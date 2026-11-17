import type {ReactNode} from 'react'
import type {Blog, BlogTextBlock, BlogTextSpan} from '@/lib/blog'

function isSafeHref(href: string) {
  return /^(https?:|mailto:|tel:|\/(?!\/)|#)/i.test(href)
}

function renderSpanMarks(span: BlogTextSpan, block: BlogTextBlock): ReactNode {
  let content: ReactNode = span.text ?? ''

  for (const mark of span.marks ?? []) {
    const annotation = block.markDefs?.find((definition) => definition._key === mark)

    if (annotation?._type === 'link' && annotation.href && isSafeHref(annotation.href)) {
      content = (
        <a
          href={annotation.href}
          target={annotation.blank ? '_blank' : undefined}
          rel={annotation.blank ? 'noreferrer' : undefined}
          className='text-[#6c3fb8] underline underline-offset-2'>
          {content}
        </a>
      )
    } else if (mark === 'strong') {
      content = <strong>{content}</strong>
    } else if (mark === 'em') {
      content = <em>{content}</em>
    } else if (mark === 'underline') {
      content = <u>{content}</u>
    } else if (mark === 'strike-through') {
      content = <s>{content}</s>
    } else if (mark === 'code') {
      content = <code className='rounded bg-gray-100 px-1 py-0.5 text-[0.9em]'>{content}</code>
    }
  }

  return content
}

function renderBlock(block: BlogTextBlock) {
  const content = block.children?.map((span, index) => (
    <span key={span._key ?? `${block._key ?? 'block'}-${index}`}>
      {renderSpanMarks(span, block)}
    </span>
  ))

  switch (block.style) {
    case 'h2':
      return <h2 className='mt-8 text-2xl font-semibold text-[#200b38]'>{content}</h2>
    case 'h3':
      return <h3 className='mt-6 text-xl font-semibold text-[#200b38]'>{content}</h3>
    case 'h4':
      return <h4 className='mt-5 text-lg font-semibold text-[#200b38]'>{content}</h4>
    case 'blockquote':
      return (
        <blockquote className='my-6 border-l-4 border-[#efb52b] pl-5 italic text-gray-600'>
          {content}
        </blockquote>
      )
    default:
      return <p className='mt-5 leading-8 text-gray-700'>{content}</p>
  }
}

export default function BlogContent({description}: {description: Blog['description']}) {
  if (typeof description === 'string') {
    return <p className='mt-5 whitespace-pre-line leading-8 text-gray-700'>{description}</p>
  }

  const content: ReactNode[] = []
  let list: {type: 'bullet' | 'number'; items: BlogTextBlock[]} | null = null

  const flushList = () => {
    if (!list) return

    const List = list.type === 'number' ? 'ol' : 'ul'
    content.push(
      <List
        key={`list-${content.length}`}
        className={`mt-5 space-y-2 pl-6 leading-8 text-gray-700 ${
          list.type === 'number' ? 'list-decimal' : 'list-disc'
        }`}>
        {list.items.map((item, index) => (
          <li key={item._key ?? `item-${index}`}>{renderBlock(item)}</li>
        ))}
      </List>,
    )
    list = null
  }

  description.forEach((block, index) => {
    if (block.listItem) {
      if (!list || list.type !== block.listItem) {
        flushList()
        list = {type: block.listItem, items: []}
      }
      list.items.push(block)
    } else {
      flushList()
      content.push(<div key={block._key ?? `block-${index}`}>{renderBlock(block)}</div>)
    }
  })
  flushList()

  return <>{content}</>
}
