import {defineField, defineType} from 'sanity'
import {LayoutPicker} from '../components/LayoutPicker'
import {SectionGridEditor} from '../components/SectionGridEditor'

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Gallery Section',
  type: 'object',
  fields: [
    defineField({
      name: 'layoutType',
      title: 'Layout',
      type: 'string',
      components: {input: LayoutPicker},
      initialValue: 'uniformGrid',
      options: {
        list: [
          'uniformGrid','masonry','justified','customGrid',
          'slideshow','cinematic','mosaic','filmstrip',
          'album','editorial','diptych','bento','scatter','panorama',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      components: {input: SectionGridEditor},
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'colSpan',
              title: 'Column Span',
              description: 'Width in Custom Grid layout (1 = thin, 6 = full width).',
              type: 'number',
              options: {
                list: [
                  {title: '1 — thin', value: 1},
                  {title: '2 — ⅓', value: 2},
                  {title: '3 — ½', value: 3},
                  {title: '4 — ⅔', value: 4},
                  {title: '6 — full', value: 6},
                ],
              },
              initialValue: 3,
            }),
            defineField({
              name: 'featured',
              title: 'Featured',
              description: 'Spans wider in Masonry layout.',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'widthCap',
              title: 'Width',
              description: 'Contained = max readable width. Full = edge-to-edge. Used in Cinematic layout.',
              type: 'string',
              options: {
                list: [
                  {title: 'Contained', value: 'contained'},
                  {title: 'Full bleed', value: 'full'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'full',
            }),
            defineField({
              name: 'focalPoint',
              title: 'Focal Point',
              description: 'Where to center the image in Slideshow layout (0–1 range).',
              type: 'object',
              fields: [
                {name: 'x', type: 'number', title: 'X (0–1)'},
                {name: 'y', type: 'number', title: 'Y (0–1)'},
              ],
            }),
          ],
        },
      ],
    }),

    // ── Justified settings ────────────────────────────────────────────
    defineField({
      name: 'rowHeight',
      title: 'Target Row Height (px)',
      type: 'number',
      initialValue: 300,
      description: 'Target height for each row of images.',
      hidden: ({parent}) => parent?.layoutType !== 'justified',
    }),

    // ── Masonry + UniformGrid settings ────────────────────────────────
    defineField({
      name: 'columnCount',
      title: 'Number of Columns',
      type: 'number',
      options: {
        list: [
          {title: '2 columns', value: 2},
          {title: '3 columns', value: 3},
          {title: '4 columns', value: 4},
        ],
      },
      initialValue: 3,
      hidden: ({parent}) =>
        parent?.layoutType !== 'masonry' && parent?.layoutType !== 'uniformGrid',
    }),

    // ── Slideshow settings ────────────────────────────────────────────
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.layoutType !== 'slideshow',
    }),
    defineField({
      name: 'duration',
      title: 'Autoplay Duration (seconds)',
      type: 'number',
      initialValue: 4,
      hidden: ({parent}) => parent?.layoutType !== 'slideshow',
    }),

    // ── Mosaic settings ───────────────────────────────────────────────
    defineField({
      name: 'heroIndex',
      title: 'Hero Image Position',
      description: 'Which image in the list to use as the large hero (0 = first).',
      type: 'number',
      initialValue: 0,
      hidden: ({parent}) => parent?.layoutType !== 'mosaic',
    }),
    defineField({
      name: 'supportCount',
      title: 'Number of Supporting Images',
      type: 'number',
      options: {
        list: [
          {title: '2', value: 2},
          {title: '3', value: 3},
          {title: '4', value: 4},
          {title: '6', value: 6},
        ],
      },
      initialValue: 4,
      hidden: ({parent}) => parent?.layoutType !== 'mosaic',
    }),

    // ── Filmstrip settings ────────────────────────────────────────────
    defineField({
      name: 'thumbHeight',
      title: 'Thumbnail Height (px)',
      type: 'number',
      initialValue: 220,
      hidden: ({parent}) => parent?.layoutType !== 'filmstrip',
    }),

    // ── Album settings ────────────────────────────────────────────────
    defineField({
      name: 'thumbnailPosition',
      title: 'Thumbnail Strip Position',
      description: 'Where the thumbnail navigator appears relative to the main focus image.',
      type: 'string',
      options: {
        list: [
          {title: 'Right side', value: 'right'},
          {title: 'Below', value: 'bottom'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'right',
      hidden: ({parent}) => parent?.layoutType !== 'album',
    }),
    defineField({
      name: 'thumbnailSize',
      title: 'Thumbnail Size (px)',
      type: 'number',
      initialValue: 88,
      description: 'Width and height of each thumbnail in the strip.',
      hidden: ({parent}) => parent?.layoutType !== 'album',
    }),

    // ── Editorial settings ────────────────────────────────────────────
    defineField({
      name: 'heroSide',
      title: 'Hero Image Side',
      description: 'Which side the large hero image appears on.',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
      hidden: ({parent}) => parent?.layoutType !== 'editorial',
    }),

    // ── Bento settings ────────────────────────────────────────────────
    defineField({
      name: 'bentoTemplate',
      title: 'Bento Template',
      description: 'A = 6 images (1 big + 4 + 1 full). B = 5 images (2x2 + wide). C = 7 images (asymmetric).',
      type: 'string',
      options: {
        list: [
          {title: 'A — 6 images', value: 'A'},
          {title: 'B — 5 images', value: 'B'},
          {title: 'C — 7 images', value: 'C'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'A',
      hidden: ({parent}) => parent?.layoutType !== 'bento',
    }),

    // ── Panorama settings ─────────────────────────────────────────────
    defineField({
      name: 'panoramaHeight',
      title: 'Strip Height (px)',
      type: 'number',
      initialValue: 380,
      description: 'Fixed height of the horizontal panorama strip.',
      hidden: ({parent}) => parent?.layoutType !== 'panorama',
    }),
  ],
  preview: {
    select: {
      layoutType: 'layoutType',
      media: 'images.0',
    },
    prepare({layoutType, media}: {layoutType?: string; media?: unknown}) {
      const labels: Record<string, string> = {
        justified: 'Justified',
        masonry: 'Masonry',
        uniformGrid: 'Uniform Grid',
        customGrid: 'Custom Grid',
        slideshow: 'Slideshow',
        cinematic: 'Cinematic',
        mosaic: 'Mosaic',
        filmstrip: 'Filmstrip',
        album: 'Album',
        editorial: 'Editorial',
        diptych: 'Diptych',
        bento: 'Bento',
        scatter: 'Scatter',
        panorama: 'Panorama',
      }
      return {
        title: labels[layoutType ?? ''] ?? 'Section',
        media: media as Parameters<typeof Object>[0],
      }
    },
  },
})
