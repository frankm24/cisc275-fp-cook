import { Project, DrafterPage, Route, StateModel } from "./types";

const todoPages: DrafterPage[] = [
    {
        id: "todo-p1",
        name: "index",
        components: [
            {
                id: "todo-c1",
                type: "Header",
                config: { content: "My Todo App", level: 1 },
                style: {},
            },
            {
                id: "todo-c2",
                type: "Text",
                config: { content: "Welcome to your todo list!" },
                style: {},
            },
            {
                id: "todo-c3",
                type: "Button",
                config: { label: "View Tasks", route: "task_list" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Show greeting based on username",
        ifAnnotations: [
            { id: "if1", description: "if tasks list is not empty" },
        ],
        forAnnotations: [],
        position: { x: 100, y: 100 },
    },
    {
        id: "todo-p2",
        name: "task_list",
        components: [
            {
                id: "todo-c4",
                type: "Header",
                config: { content: "Task List", level: 2 },
                style: {},
            },
            {
                id: "todo-c5",
                type: "Text",
                config: { content: "Your current tasks:" },
                style: {},
            },
            {
                id: "todo-c6",
                type: "Button",
                config: { label: "Add Task", route: "add_task" },
                style: {},
            },
            {
                id: "todo-c7",
                type: "Button",
                config: { label: "Back to Home", route: "index" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Display all tasks in state.tasks",
        ifAnnotations: [],
        forAnnotations: [
            { id: "for1", description: "for each task in state.tasks" },
        ],
        position: { x: 400, y: 100 },
    },
    {
        id: "todo-p3",
        name: "add_task",
        components: [
            {
                id: "todo-c8",
                type: "Header",
                config: { content: "Add New Task", level: 2 },
                style: {},
            },
            {
                id: "todo-c9",
                type: "TextBox",
                config: { name: "task_name", defaultValue: "" },
                style: {},
            },
            {
                id: "todo-c10",
                type: "TextArea",
                config: { name: "task_description", defaultValue: "" },
                style: {},
            },
            {
                id: "todo-c11",
                type: "SelectBox",
                config: {
                    name: "priority",
                    options: ["Low", "Medium", "High"],
                    defaultValue: "Medium",
                },
                style: {},
            },
            {
                id: "todo-c12",
                type: "Button",
                config: { label: "Save Task", route: "task_list" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Form to add a new task",
        ifAnnotations: [],
        forAnnotations: [],
        position: { x: 700, y: 100 },
    },
    {
        id: "todo-p4",
        name: "task_detail",
        components: [
            {
                id: "todo-c13",
                type: "Header",
                config: { content: "Task Detail", level: 2 },
                style: {},
            },
            {
                id: "todo-c14",
                type: "Text",
                config: { content: "Task details shown here" },
                style: {},
            },
            {
                id: "todo-c15",
                type: "CheckBox",
                config: { name: "completed", defaultValue: false },
                style: {},
            },
            {
                id: "todo-c16",
                type: "Button",
                config: { label: "Delete Task", route: "task_list" },
                style: {},
            },
            {
                id: "todo-c17",
                type: "Button",
                config: { label: "Back", route: "task_list" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Show details of state.current_task",
        ifAnnotations: [
            {
                id: "if2",
                description: "if state.current_task.completed is True",
            },
        ],
        forAnnotations: [],
        position: { x: 700, y: 300 },
    },
];

const todoRoutes: Route[] = [
    {
        id: "todo-r1",
        name: "view_tasks",
        sourcePageId: "todo-p1",
        targetPageId: "todo-p2",
        stateAnnotation: "",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "todo-r2",
        name: "go_add_task",
        sourcePageId: "todo-p2",
        targetPageId: "todo-p3",
        stateAnnotation: "",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "todo-r3",
        name: "save_task",
        sourcePageId: "todo-p3",
        targetPageId: "todo-p2",
        stateAnnotation: "Add task to state.tasks list",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "todo-r4",
        name: "view_detail",
        sourcePageId: "todo-p2",
        targetPageId: "todo-p4",
        stateAnnotation: "Set state.current_task",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "todo-r5",
        name: "back_from_detail",
        sourcePageId: "todo-p4",
        targetPageId: "todo-p2",
        stateAnnotation: "",
        ifAnnotations: [],
        forAnnotations: [],
    },
];

const todoStateModel: StateModel = {
    primaryAttributes: [
        {
            id: "ts1",
            name: "username",
            type: "str",
            description: "The logged-in user's name",
        },
        {
            id: "ts2",
            name: "tasks",
            type: "Task",
            description: "List of all tasks",
            isListOf: true,
        },
        {
            id: "ts3",
            name: "current_task_index",
            type: "int",
            description: "Index of the currently viewed task",
        },
        {
            id: "ts4",
            name: "filter_priority",
            type: "str",
            description: "Current priority filter",
        },
    ],
    secondaryDataclasses: [
        {
            id: "todo-dc1",
            name: "Task",
            attributes: [
                { id: "ta1", name: "name", type: "str", description: "Task name" },
                {
                    id: "ta2",
                    name: "description",
                    type: "str",
                    description: "Task description",
                },
                {
                    id: "ta3",
                    name: "priority",
                    type: "str",
                    description: "Priority level",
                },
                {
                    id: "ta4",
                    name: "completed",
                    type: "bool",
                    description: "Whether task is done",
                },
            ],
        },
    ],
};

export const demoProject1: Project = {
    id: "demo-1",
    name: "Todo App",
    purpose:
        "A simple task management application that allows users to create, view, and complete tasks with priority levels.",
    pages: todoPages,
    routes: todoRoutes,
    stateModel: todoStateModel,
    lastModified: Date.now(),
};

const blogPages: DrafterPage[] = [
    {
        id: "blog-p1",
        name: "index",
        components: [
            {
                id: "blog-c1",
                type: "Header",
                config: { content: "My Blog", level: 1 },
                style: {},
            },
            {
                id: "blog-c2",
                type: "Text",
                config: { content: "Welcome to my personal blog!" },
                style: {},
            },
            {
                id: "blog-c3",
                type: "Button",
                config: { label: "View All Posts", route: "post_list" },
                style: {},
            },
            {
                id: "blog-c4",
                type: "Button",
                config: { label: "About Me", route: "about" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Show recent posts preview",
        ifAnnotations: [],
        forAnnotations: [
            {
                id: "for-b1",
                description: "for each post in state.recent_posts",
            },
        ],
        position: { x: 100, y: 100 },
    },
    {
        id: "blog-p2",
        name: "post_list",
        components: [
            {
                id: "blog-c5",
                type: "Header",
                config: { content: "All Posts", level: 2 },
                style: {},
            },
            {
                id: "blog-c6",
                type: "TextBox",
                config: { name: "search_query", defaultValue: "" },
                style: {},
            },
            {
                id: "blog-c7",
                type: "Button",
                config: { label: "New Post", route: "create_post" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "List all posts filtered by search",
        ifAnnotations: [
            { id: "if-b1", description: "if state.is_author is True" },
        ],
        forAnnotations: [
            { id: "for-b2", description: "for each post in state.posts" },
        ],
        position: { x: 400, y: 100 },
    },
    {
        id: "blog-p3",
        name: "create_post",
        components: [
            {
                id: "blog-c8",
                type: "Header",
                config: { content: "Create New Post", level: 2 },
                style: {},
            },
            {
                id: "blog-c9",
                type: "TextBox",
                config: { name: "title", defaultValue: "" },
                style: {},
            },
            {
                id: "blog-c10",
                type: "TextArea",
                config: { name: "content", defaultValue: "" },
                style: {},
            },
            {
                id: "blog-c11",
                type: "SelectBox",
                config: {
                    name: "category",
                    options: ["Tech", "Life", "Opinion", "Tutorial"],
                    defaultValue: "Tech",
                },
                style: {},
            },
            {
                id: "blog-c12",
                type: "Button",
                config: { label: "Publish", route: "post_list" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Form to create a new blog post",
        ifAnnotations: [],
        forAnnotations: [],
        position: { x: 700, y: 100 },
    },
    {
        id: "blog-p4",
        name: "about",
        components: [
            {
                id: "blog-c13",
                type: "Header",
                config: { content: "About Me", level: 2 },
                style: {},
            },
            {
                id: "blog-c14",
                type: "Text",
                config: {
                    content: "I am a blogger who loves to share ideas.",
                },
                style: {},
            },
            {
                id: "blog-c15",
                type: "Button",
                config: { label: "Back to Home", route: "index" },
                style: {},
            },
        ],
        style: { padding: "20px" },
        stateAnnotation: "Show author bio from state.author_bio",
        ifAnnotations: [],
        forAnnotations: [],
        position: { x: 100, y: 400 },
    },
];

const blogRoutes: Route[] = [
    {
        id: "blog-r1",
        name: "view_posts",
        sourcePageId: "blog-p1",
        targetPageId: "blog-p2",
        stateAnnotation: "",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "blog-r2",
        name: "go_about",
        sourcePageId: "blog-p1",
        targetPageId: "blog-p4",
        stateAnnotation: "",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "blog-r3",
        name: "go_create",
        sourcePageId: "blog-p2",
        targetPageId: "blog-p3",
        stateAnnotation: "",
        ifAnnotations: [],
        forAnnotations: [],
    },
    {
        id: "blog-r4",
        name: "publish_post",
        sourcePageId: "blog-p3",
        targetPageId: "blog-p2",
        stateAnnotation: "Add new post to state.posts",
        ifAnnotations: [],
        forAnnotations: [],
    },
];

const blogStateModel: StateModel = {
    primaryAttributes: [
        {
            id: "bs1",
            name: "author_name",
            type: "str",
            description: "The blog author name",
        },
        {
            id: "bs2",
            name: "posts",
            type: "Post",
            description: "All blog posts",
            isListOf: true,
        },
        {
            id: "bs3",
            name: "is_author",
            type: "bool",
            description: "Whether current user is the author",
        },
        {
            id: "bs4",
            name: "author_bio",
            type: "str",
            description: "Short bio of the author",
        },
        {
            id: "bs5",
            name: "search_query",
            type: "str",
            description: "Current search string",
        },
    ],
    secondaryDataclasses: [
        {
            id: "blog-dc1",
            name: "Post",
            attributes: [
                { id: "ba1", name: "title", type: "str", description: "Post title" },
                {
                    id: "ba2",
                    name: "content",
                    type: "str",
                    description: "Post content",
                },
                {
                    id: "ba3",
                    name: "category",
                    type: "str",
                    description: "Post category",
                },
                {
                    id: "ba4",
                    name: "published",
                    type: "bool",
                    description: "Is post published",
                },
            ],
        },
    ],
};

export const demoProject2: Project = {
    id: "demo-2",
    name: "Blog Platform",
    purpose:
        "A personal blogging platform where users can create, categorize, and publish posts with search functionality.",
    pages: blogPages,
    routes: blogRoutes,
    stateModel: blogStateModel,
    lastModified: Date.now(),
};
