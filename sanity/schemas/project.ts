import {defineField, defineType} from 'sanity'
import {GridLayoutEditor} from '../components/GridLayoutEditor'

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
          {title: 'Custom — visual grid editor', value: 'custom'},
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
      components: {input: GridLayoutEditor},
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
            defineField({
              name: 'colSpan',
              title: 'Column Span',
              description: 'Width in "Custom" layout mode (1 = thin, 6 = full width).',
              type: 'number',
              options: {
                list: [
                  {title: '1 — thin', value: 1},
                  {title: '2 — third', value: 2},
                  {title: '3 — half', value: 3},
                  {title: '4 — two-thirds', value: 4},
                  {title: '6 — full', value: 6},
                ],
              },
              initialValue: 3,
            }),
          ],
        },
      ],
      hidden: ({document}) => document?.mediaType !== 'photo',
    }),
    defineField({
      name: 'sections',
      title: 'Gallery Sections',
      description:
        'New per-section gallery with 8 layout options. When populated, replaces the legacy Gallery on the live site. Use "Convert Gallery → Sections" to migrate existing images.',
      type: 'array',
      of: [{type: 'gallerySection'}],
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

