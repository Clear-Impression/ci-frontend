import type {StructureResolver} from 'sanity/structure'
import {pageHeaders} from '../data/page-headers'

export const structure: StructureResolver = (S) => {
  const header = (pageId: string, title = 'Page header') => S.listItem()
    .id(`${pageId}-header`)
    .title(title)
    .child(S.document()
      .schemaType('pageHeader')
      .documentId(`pageHeader.${pageId}`)
      .title(`${pageHeaders[pageId].label} header`)
      .initialValueTemplate('page-header', {pageId}))

  return S.list().title('Content').items([
    S.listItem().id('faq').title('FAQ').child(S.list().title('FAQ').items([
      header('faq'),
      S.documentTypeListItem('faq').title('Questions'),
    ])),
    S.listItem().id('services').title('Services').child(S.list().title('Services').items([
      header('services'),
      S.documentTypeListItem('service').title('Service pages'),
    ])),
    S.listItem().id('locations').title('Locations').child(S.list().title('Locations').items([
      header('locations'),
      ...Object.entries(pageHeaders)
        .filter(([pageId]) => pageId.startsWith('location-'))
        .map(([pageId, page]) => header(pageId, page.label)),
    ])),
    ...['home', 'about', 'reviews', 'feedback', 'quote', 'terms'].map((pageId) =>
      S.listItem().id(pageId).title(pageHeaders[pageId].label)
        .child(S.list().title(pageHeaders[pageId].label).items([header(pageId)])),
    ),
  ])
}
