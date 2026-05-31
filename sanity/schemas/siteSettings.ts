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

    // ─── Theme ──────────────────────────────────────────────────────────────
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color code for link highlights and hover states, e.g. #e5e5e5.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
