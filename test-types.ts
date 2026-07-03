export interface AIResultSection {
  title: string;
  items: {
    title?: string;
    content: string;
  }[];
}
export interface AIOutput {
  sections: AIResultSection[];
}
