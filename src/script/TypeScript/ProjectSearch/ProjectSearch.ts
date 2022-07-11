import { Project, ProjectList } from "../DataBaseHandler/Project";
import { updateProject } from "./ProjectListGenerator";
import { main as searchBarMain, setSearch } from "./SearchBar";
import { main as SortByMain} from "./SortBy";

/**
 * main function initializes search bar & the list of portfolio projects
 */
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
