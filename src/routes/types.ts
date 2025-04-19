export interface BlogResponse {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    blogText: string;
    blogSummary?: string;
}