import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 15,
    min: 9,
  },
  wordsPerSentence: {
    max: 100,
    min: 80,
  },
});

export const getLargeText = (sentences: number) => {
    return lorem.generateSentences(sentences)
}
