import {defineField, defineType} from 'sanity'

// Larger videos make city pages slow to load on phones.
const maxVideoMegabytes = 50

type MediaValue = {
  photo?: {asset?: {_ref?: string}}
  video?: {asset?: {_ref?: string}}
}

// A photo, a video, or both. The video plays in place of the photo,
// and the photo shows while the video loads.
export const photoOrVideo = defineType({
  name: 'photoOrVideo',
  title: 'Photo or video',
  type: 'object',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description:
        'Drag a photo here. After it uploads, drag the circle on the photo to choose what stays in view when it’s cropped.',
      options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp'},
    }),
    defineField({
      name: 'video',
      title: 'Video (optional)',
      type: 'file',
      description: `Drag an MP4 video here, up to ${maxVideoMegabytes} MB. It plays silently on a loop with a pause button. Clips under 30 seconds load fastest.`,
      options: {accept: 'video/mp4,video/webm'},
      validation: (rule) =>
        rule.custom(async (value, context) => {
          const ref = value?.asset?._ref
          if (!ref) return true

          const size = await context
            .getClient({apiVersion: '2026-10-19'})
            .fetch<number | null>('*[_id == $ref][0].size', {ref})
          const megabytes = (size ?? 0) / 1024 / 1024

          return megabytes > maxVideoMegabytes
            ? `This video is ${Math.round(megabytes)} MB. Please use one under ${maxVideoMegabytes} MB so the page loads quickly.`
            : true
        }),
    }),
    defineField({
      name: 'alt',
      title: 'What it shows',
      type: 'string',
      description:
        'One sentence for people who use screen readers, for example “Our team cleaning the windows of a two-story home in Mesa.”',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const media = context.parent as MediaValue | undefined
          const hasMedia = Boolean(media?.photo?.asset?._ref || media?.video?.asset?._ref)

          return hasMedia && !alt?.trim() ? 'Describe what the photo or video shows.' : true
        }),
    }),
  ],
})
