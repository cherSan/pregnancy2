import { Page as PageComponent } from './page';
import {ForegroundHeader} from "@/components/page/foreground-header";
import {PageContent} from "@/components/page/content";
import {PageForeground} from "@/components/page/foreground";
import {Header} from "@/components/page/header";

type Interface = typeof PageComponent & {
    ForegroundHeader: typeof ForegroundHeader;
    Content: typeof PageContent;
    Foreground: typeof PageForeground;
    Header: typeof Header;
};

export const Page = PageComponent as Interface;

Page.Header = Header;
Page.ForegroundHeader = ForegroundHeader;
Page.Content = PageContent;
Page.Foreground = PageForeground;