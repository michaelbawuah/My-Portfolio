import content from "./case-content.json";
export const details=content;
export type CaseSlug=keyof typeof details;
export type PipelineStep={title:string;text:string};
