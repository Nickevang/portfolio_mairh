import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Slideshow Caption',
      type: 'string',
      description: 'Short text shown under the title in the homepage slideshow (optional).',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          {title: 'Photo', value: 'photo'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'photo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Mux Video',
      type: 'mux.video',
      hidden: ({document}) => document?.mediaType !== 'video',
    }),
    defineField({
      name: 'subprojects',
      title: 'Sub-projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description: 'Child projects displayed as a gallery on this page (e.g. episodes in a series, shoots in a campaign).',
    }),
    defineField({
      name: 'galleryLayout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Mixed — per-photo control (half / third / full)', value: 'mixed'},
          {title: 'Masonry — waterfall auto-flow', value: 'masonry'},
          {title: '2 columns — uniform grid', value: '2-col'},
          {title: '3 columns — uniform grid', value: '3-col'},
        ],
        layout: 'radio',
      },
      initialValue: 'mixed',
      hidden: ({document}) => document?.mediaType !== 'photo',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'displaySize',
              title: 'Display Size',
              description: 'Controls width in "Mixed" layout mode.',
              type: 'string',
              options: {
                list: [
                  {title: 'Half — 2 per row', value: 'half'},
                  {title: 'Third — 3 per row', value: 'third'},
                  {title: 'Full — hero width', value: 'full'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'half',
            }),
          ],
        },
      ],
      hidden: ({document}) => document?.mediaType !== 'photo',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Brief project background shown on the detail page.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      mediaType: 'mediaType',
    },
    prepare({title, media, mediaType}) {
      return {
        title,
        subtitle: mediaType === 'video' ? 'Video' : 'Photo',
        media,
      }
    },
  },
})

