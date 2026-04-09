import { useCallback, useMemo, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    NodeProps,
    EdgeProps,
    getBezierPath,
    BaseEdge,
    Node,
    Edge,
    Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DrafterPage, Route } from "../types";
import { makeId } from "../types";

interface PageNodeData {
    label: string;
    pageId: string;
    isSelected: boolean;
    onSelect: (pageId: string) => void;
    onDelete: (pageId: string) => void;
}

type PageNode = Node<PageNodeData>;

function PageNodeComponent({ data }: NodeProps<PageNode>) {
    return (
        <div
            style={{
                background: data.isSelected ? "#dbeafe" : "white",
                border: data.isSelected
                    ? "2px solid #3b82f6"
                    : "2px solid #e2e8f0",
                borderRadius: 8,
                padding: "10px 14px",
                minWidth: 120,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: 13,
                fontWeight: 600,
                color: "#1e293b",
                userSelect: "none",
            }}
            onClick={() => data.onSelect(data.pageId)}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: "#94a3b8" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ flex: 1 }}>{data.label}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onDelete(data.pageId);
                    }}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: 0,
                        lineHeight: 1,
                    }}
                    title="Delete page"
                >
                    ×
                </button>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: "#3b82f6" }}
            />
        </div>
    );
}

interface RouteEdgeData {
    routeId: string;
    label: string;
    onDelete: (routeId: string) => void;
}

type RouteEdge = Edge<RouteEdgeData>;

function RouteEdgeComponent({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: EdgeProps<RouteEdge>) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ stroke: "#3b82f6", strokeWidth: 2 }}
            />
            {data !== undefined && (
                <foreignObject
                    x={labelX - 40}
                    y={labelY - 12}
                    width={80}
                    height={24}
                    style={{ overflow: "visible" }}
                >
                    <div
                        style={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: 4,
                            padding: "1px 6px",
                            fontSize: 11,
                            color: "#475569",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <span
                            style={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {data.label}
                        </span>
                        <button
                            onClick={() => data.onDelete(data.routeId)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: 11,
                                padding: 0,
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    </div>
                </foreignObject>
            )}
        </>
    );
}

// Declare outside component to avoid recreation
const nodeTypes = { pageNode: PageNodeComponent };
const edgeTypes = { routeEdge: RouteEdgeComponent };

interface PageGraphProps {
    pages: DrafterPage[];
    routes: Route[];
    selectedPageId: string | null;
    onSelectPage: (pageId: string | null) => void;
    onAddPage: () => void;
    onDeletePage: (pageId: string) => void;
    onAddRoute: (route: Route) => void;
    onDeleteRoute: (routeId: string) => void;
    onUpdatePagePosition: (
        pageId: string,
        position: { x: number; y: number }
    ) => void;
}

export function PageGraph({
    pages,
    routes,
    selectedPageId,
    onSelectPage,
    onAddPage,
    onDeletePage,
    onAddRoute,
    onDeleteRoute,
    onUpdatePagePosition,
}: PageGraphProps) {
    const initialNodes: PageNode[] = useMemo(
        () =>
            pages.map((page) => ({
                id: page.id,
                type: "pageNode",
                position: page.position,
                data: {
                    label: page.name,
                    pageId: page.id,
                    isSelected: page.id === selectedPageId,
                    onSelect: onSelectPage,
                    onDelete: onDeletePage,
                },
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const initialEdges: RouteEdge[] = useMemo(
        () =>
            routes.map((route) => ({
                id: route.id,
                type: "routeEdge",
                source: route.sourcePageId,
                target: route.targetPageId,
                data: {
                    routeId: route.id,
                    label: route.name,
                    onDelete: onDeleteRoute,
                },
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync nodes when pages change (selection, names)
    useEffect(() => {
        setNodes((prev) =>
            prev.map((node) => {
                const page = pages.find((p) => p.id === node.id);
                if (page === undefined) return node;
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: page.name,
                        isSelected: page.id === selectedPageId,
                        onSelect: onSelectPage,
                        onDelete: onDeletePage,
                    },
                };
            })
        );
    }, [pages, selectedPageId, onSelectPage, onDeletePage, setNodes]);

    // Sync edges when routes change
    useEffect(() => {
        setEdges(
            routes.map((route) => ({
                id: route.id,
                type: "routeEdge",
                source: route.sourcePageId,
                target: route.targetPageId,
                data: {
                    routeId: route.id,
                    label: route.name,
                    onDelete: onDeleteRoute,
                },
            }))
        );
    }, [routes, onDeleteRoute, setEdges]);

    // Add new page nodes when pages array grows
    useEffect(() => {
        setNodes((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const newNodes: PageNode[] = pages
                .filter((p) => !existingIds.has(p.id))
                .map((page) => ({
                    id: page.id,
                    type: "pageNode",
                    position: page.position,
                    data: {
                        label: page.name,
                        pageId: page.id,
                        isSelected: page.id === selectedPageId,
                        onSelect: onSelectPage,
                        onDelete: onDeletePage,
                    },
                }));
            if (newNodes.length === 0) return prev;
            return [...prev, ...newNodes];
        });
    }, [pages, selectedPageId, onSelectPage, onDeletePage, setNodes]);

    // Remove deleted page nodes
    useEffect(() => {
        setNodes((prev) => {
            const pageIds = new Set(pages.map((p) => p.id));
            const filtered = prev.filter((n) => pageIds.has(n.id));
            if (filtered.length === prev.length) return prev;
            return filtered;
        });
    }, [pages, setNodes]);

    const onConnect = useCallback(
        (connection: Connection) => {
            const routeName = prompt("Route name:") ?? "route";
            const newRoute: Route = {
                id: makeId(),
                name: routeName,
                sourcePageId: connection.source,
                targetPageId: connection.target,
                stateAnnotation: "",
                ifAnnotations: [],
                forAnnotations: [],
            };
            onAddRoute(newRoute);
            setEdges((eds) =>
                addEdge(
                    {
                        ...connection,
                        id: newRoute.id,
                        type: "routeEdge",
                        data: {
                            routeId: newRoute.id,
                            label: routeName,
                            onDelete: onDeleteRoute,
                        },
                    },
                    eds
                )
            );
        },
        [onAddRoute, onDeleteRoute, setEdges]
    );

    function handleNodeDragStop(_event: React.MouseEvent, node: PageNode) {
        onUpdatePagePosition(node.id, node.position);
    }

    return (
        <div style={{ height: "100%", position: "relative" }}>
            <div
                style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    display: "flex",
                    gap: 8,
                }}
            >
                <button
                    onClick={onAddPage}
                    style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                >
                    + Add Page
                </button>
                <div
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        padding: "8px 12px",
                        fontSize: 12,
                        color: "#64748b",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                >
                    Drag handles to connect pages → routes
                </div>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={handleNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
