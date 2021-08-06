import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: process.env.SANITY_ID || process.env.NEXT_PUBLIC_SANITY_ID,
  dataset: 'production',
  useCdn: true,
  apiVersion: '2021-03-25'
})