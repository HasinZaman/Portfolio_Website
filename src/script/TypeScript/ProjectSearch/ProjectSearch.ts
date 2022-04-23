import { Project, ProjectList } from "../DataBaseHandler/Project";
import { updateProject } from "./ProjectListGenerator";
import { main as searchBarMain, setSearch } from "./SearchBar";
import { main as SortByMain} from "./SortBy";

export function main() {
    ProjectList.getInstance()
    .update(
        () => {
            updateProject();
        }
    )

    searchBarMain();
    SortByMain();
}
