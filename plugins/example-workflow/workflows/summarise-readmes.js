export const meta = {
  name: 'summarise-readmes',
  description: 'Summarise every README in the repository in one line each',
}

const found = await agent('List every README.md file in this repository, one path per entry.', {
  schema: { type: 'object', required: ['files'], properties: { files: { type: 'array', items: { type: 'string' } } } },
})

const summaries = await pipeline(found.files, (file) =>
  agent(`Read ${file} and summarise it in one line.`, { label: file }),
)

return summaries.filter(Boolean)
