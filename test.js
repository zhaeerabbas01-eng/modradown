const schema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "The title of this section, e.g. 'Trending Hashtags' or 'Short Captions'" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Optional title for this specific item, e.g. 'Idea 1' or 'Professional Bio'" },
                content: { type: "string", description: "The actual content, e.g. the hashtag, caption text, or idea details" }
              },
              required: ["content"]
            }
          }
        },
        required: ["title", "items"]
      }
    }
  },
  required: ["sections"]
};
