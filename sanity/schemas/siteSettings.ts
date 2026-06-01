import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ─── Branding & Identity ────────────────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Display name shown in the navbar and browser tab.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line descriptor shown beneath the site name.',
    }),

    // ─── Homepage ───────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Large headline displayed on the homepage.',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
      description: 'Subtitle text below the hero heading.',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description: 'Hand-pick projects to show on the homepage. Leave empty to show all latest.',
    }),
    defineField({
      name: 'heroBgImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Full-width background photo behind the hero text.',
    }),
    defineField({
      name: 'heroLayout',
      title: 'Hero Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Minimal — text only', value: 'minimal'},
          {title: 'Fullscreen — image fills viewport height', value: 'fullscreen'},
          {title: 'Split — image left, text right', value: 'split'},
        ],
        layout: 'radio',
      },
      initialValue: 'minimal',
    }),
    defineField({
      name: 'showAboutPreview',
      title: 'Show About Preview on Homepage',
      type: 'boolean',
      description: 'Adds a bio teaser section below the project grid.',
      initialValue: false,
    }),

    // ─── About ──────────────────────────────────────────────────────────────
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Photographer portrait shown on the About page.',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Full biography text for the About page.',
    }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'e.g. Photography, Videography, Direction.',
    }),

    // ─── Contact ────────────────────────────────────────────────────────────
    defineField({
      name: 'contactHeading',
      title: 'Contact Heading',
      type: 'string',
      description: 'Headline on the Contact page, e.g. "Let\'s work together."',
    }),
    defineField({
      name: 'contactNote',
      title: 'Contact Note',
      type: 'text',
      rows: 3,
      description: 'Short intro paragraph shown above the contact form.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Direct email address shown as a fallback link.',
    }),

    // ─── Social Links ────────────────────────────────────────────────────────
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'vimeo',
      title: 'Vimeo URL',
      type: 'url',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),

    // ─── SEO / Meta ─────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Global <title> tag value.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Global meta description.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Share image used when the site is linked on social media.',
    }),

    // ─── Work / Cards ───────────────────────────────────────────────────────
    defineField({
      name: 'workGridCols',
      title: 'Work Grid Columns',
      type: 'number',
      options: {
        list: [
          {title: '2 columns', value: 2},
          {title: '3 columns', value: 3},
          {title: '4 columns', value: 4},
        ],
      },
      initialValue: 3,
    }),
    defineField({
      name: 'cardStyle',
      title: 'Project Card Style',
      type: 'string',
      options: {
        list: [
          {title: 'Title below image', value: 'below'},
          {title: 'Title on hover overlay', value: 'overlay'},
        ],
        layout: 'radio',
      },
      initialValue: 'below',
    }),

    // ─── Theme ──────────────────────────────────────────────────────────────
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color code for link highlights and hover states, e.g. #e5e5e5.',
    }),
    defineField({
      name: 'colorScheme',
      title: 'Color Scheme',
      type: 'string',
      options: {
        list: [
          {title: 'Dark', value: 'dark'},
          {title: 'Light', value: 'light'},
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'fontFamily',
      title: 'Font',
      type: 'string',
      options: {
        list: [
          {title: 'Geist — Modern sans-serif (default)', value: 'geist'},
          {title: 'Playfair Display — Editorial serif', value: 'playfair'},
          {title: 'DM Sans — Clean humanist', value: 'dm-sans'},
          {title: 'PF Transport — Geometric sans', value: 'pf-transport'},
          {title: 'PF Bague Sans Pro — Wide geometric', value: 'pf-bague'},
          {title: 'Asty CF — Rounded geometric', value: 'asty'},
        ],
        layout: 'radio',
      },
      initialValue: 'geist',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
