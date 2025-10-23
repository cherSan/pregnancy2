import {PageContent} from "@/components/page/content";
import {PageForeground} from "@/components/page/foreground";
import {Header} from "@/components/page/header";
import {Page as PageComponent} from './page';

type Interface = typeof PageComponent & {
    Content: typeof PageContent;
    Foreground: typeof PageForeground;
    Header: typeof Header;
};

export const Page = PageComponent as Interface;

Page.Header = Header;
Page.Content = PageContent;
Page.Foreground = PageForeground;