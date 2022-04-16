import { ProjectList } from "../DataBaseHandler/Project";

ProjectList.getInstance()
    .update(
        () => {
            console.log(ProjectList.getInstance().project)
        })

