import { List as ListComponent } from "@/components/list/list.component";
import {Record} from "@/components/list/record.component";

const List = ListComponent as typeof ListComponent & { Item: typeof Record };

List.Item = Record;

export { List };