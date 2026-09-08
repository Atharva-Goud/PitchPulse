(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$SearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/SearchModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const navItems = [
    {
        href: '/',
        label: 'Home'
    },
    {
        href: '/news',
        label: 'News'
    },
    {
        href: '/transfers',
        label: 'Transfers'
    },
    {
        href: '/matches',
        label: 'Matches'
    },
    {
        href: '/fixtures',
        label: 'Fixtures'
    }
];
function Header() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchOpen, setSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-16 items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/",
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 29,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xl font-bold tracking-tight text-white",
                                                    children: [
                                                        "PITCH",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-emerald-400",
                                                            children: "INTEL"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Header.tsx",
                                                            lineNumber: 31,
                                                            columnNumber: 24
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 30,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 28,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "ml-10 hidden md:flex items-center gap-1",
                                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    className: `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === item.href ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`,
                                                    children: item.label
                                                }, item.href, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 37,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 35,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSearchOpen(true),
                                            className: "p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors",
                                            "aria-label": "Search",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 58,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                            className: "p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors md:hidden",
                                            "aria-label": "Menu",
                                            children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 66,
                                                columnNumber: 35
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 66,
                                                columnNumber: 63
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 61,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden border-t border-white/10 bg-slate-950",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "px-4 py-3 space-y-1",
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    className: `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname === item.href ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`,
                                    children: item.label
                                }, item.href, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 76,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$SearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: searchOpen,
                onClose: ()=>setSearchOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Header.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(Header, "0ygo2hImv9JPeoC8LWG66aOuyJI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/search/SearchModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/data/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$search$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/search.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function SearchModal({ isOpen, onClose }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const performSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SearchModal.useCallback[performSearch]": async (searchQuery)=>{
            if (!searchQuery.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const searchResults = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$search$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalSearch"])(searchQuery);
                setResults(searchResults);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally{
                setLoading(false);
            }
        }
    }["SearchModal.useCallback[performSearch]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchModal.useEffect": ()=>{
            const timer = setTimeout({
                "SearchModal.useEffect.timer": ()=>{
                    performSearch(query);
                }
            }["SearchModal.useEffect.timer"], 300);
            return ({
                "SearchModal.useEffect": ()=>clearTimeout(timer)
            })["SearchModal.useEffect"];
        }
    }["SearchModal.useEffect"], [
        query,
        performSearch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchModal.useEffect": ()=>{
            if (isOpen) {
                setQuery('');
                setResults([]);
            }
        }
    }["SearchModal.useEffect"], [
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchModal.useEffect": ()=>{
            const handleEscape = {
                "SearchModal.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["SearchModal.useEffect.handleEscape"];
            if (isOpen) {
                document.addEventListener('keydown', handleEscape);
                document.body.style.overflow = 'hidden';
            }
            return ({
                "SearchModal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleEscape);
                    document.body.style.overflow = '';
                }
            })["SearchModal.useEffect"];
        }
    }["SearchModal.useEffect"], [
        isOpen,
        onClose
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 backdrop-blur-sm",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/search/SearchModal.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative min-h-screen flex items-start justify-center pt-20 px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 p-4 border-b border-white/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "h-5 w-5 text-slate-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: query,
                                    onChange: (e)=>setQuery(e.target.value),
                                    placeholder: "Search teams, players, news, transfers...",
                                    className: "flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg",
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/search/SearchModal.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-h-[60vh] overflow-y-auto",
                            children: [
                                query && !loading && results.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-8 text-center text-slate-400",
                                    children: [
                                        "No results found for “",
                                        query,
                                        "”"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, this),
                                results.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-white/5 last:border-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/50",
                                                children: group.type
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchModal.tsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "divide-y divide-white/5",
                                                children: group.items.slice(0, 5).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: group.type === 'teams' ? `/teams/${item.id}` : group.type === 'news' ? `/news/${item.id}` : '#',
                                                        onClick: onClose,
                                                        className: "flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors",
                                                        children: [
                                                            (item.logo || item.image) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative h-10 w-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: item.logo || item.image || '',
                                                                    alt: item.name || item.title || '',
                                                                    fill: true,
                                                                    className: "object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                                                    lineNumber: 126,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/search/SearchModal.tsx",
                                                                lineNumber: 125,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-white font-medium truncate",
                                                                        children: item.name || item.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/search/SearchModal.tsx",
                                                                        lineNumber: 135,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    item.shortName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-slate-400",
                                                                        children: item.shortName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/search/SearchModal.tsx",
                                                                        lineNumber: 139,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    item.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-slate-400 truncate",
                                                                        children: item.summary
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/search/SearchModal.tsx",
                                                                        lineNumber: 142,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/search/SearchModal.tsx",
                                                                lineNumber: 134,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/src/components/search/SearchModal.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchModal.tsx",
                                                lineNumber: 116,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, group.type, true, {
                                        fileName: "[project]/src/components/search/SearchModal.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/search/SearchModal.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 border-t border-white/10 bg-slate-800/50 flex items-center justify-between text-xs text-slate-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Press ESC to close"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                            className: "px-2 py-0.5 bg-slate-700 rounded text-slate-300",
                                            children: "/"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/search/SearchModal.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "to search"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/search/SearchModal.tsx",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/search/SearchModal.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/search/SearchModal.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/search/SearchModal.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/search/SearchModal.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/search/SearchModal.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(SearchModal, "+DoFhAvcOwLAUj/41BHHzKPDQQE=");
_c = SearchModal;
var _c;
__turbopack_context__.k.register(_c, "SearchModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/competitions/competitions.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "premier-league",
        "name": "Premier League",
        "shortName": "PL",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "England",
        "type": "league"
    },
    {
        "id": "la-liga",
        "name": "La Liga",
        "shortName": "LL",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "Spain",
        "type": "league"
    },
    {
        "id": "bundesliga",
        "name": "Bundesliga",
        "shortName": "BL",
        "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
        "country": "Germany",
        "type": "league"
    },
    {
        "id": "serie-a",
        "name": "Serie A",
        "shortName": "SA",
        "logo": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=100&h=100&fit=crop",
        "country": "Italy",
        "type": "league"
    },
    {
        "id": "ligue-1",
        "name": "Ligue 1",
        "shortName": "L1",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "France",
        "type": "league"
    },
    {
        "id": "champions-league",
        "name": "UEFA Champions League",
        "shortName": "UCL",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Europe",
        "type": "cup"
    },
    {
        "id": "europa-league",
        "name": "UEFA Europa League",
        "shortName": "UEL",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Europe",
        "type": "cup"
    },
    {
        "id": "fa-cup",
        "name": "FA Cup",
        "shortName": "FA",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "England",
        "type": "cup"
    },
    {
        "id": "world-cup",
        "name": "FIFA World Cup",
        "shortName": "WC",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "International",
        "type": "international"
    },
    {
        "id": "euro-2024",
        "name": "UEFA Euro 2024",
        "shortName": "Euro",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Europe",
        "type": "international"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/matches/live.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "match-live-001",
        "competition": {
            "id": "premier-league",
            "name": "Premier League",
            "shortName": "PL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "type": "league"
        },
        "homeTeam": {
            "id": "arsenal",
            "name": "Arsenal",
            "shortName": "ARS",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "awayTeam": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "homeScore": 1,
        "awayScore": 0,
        "status": "LIVE",
        "kickoff": "2026-09-08T14:00:00Z",
        "venue": "Emirates Stadium",
        "referee": "Michael Oliver",
        "matchday": 4
    },
    {
        "id": "match-live-002",
        "competition": {
            "id": "la-liga",
            "name": "La Liga",
            "shortName": "LL",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Spain",
            "type": "league"
        },
        "homeTeam": {
            "id": "real-madrid",
            "name": "Real Madrid",
            "shortName": "RMA",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "awayTeam": {
            "id": "barcelona",
            "name": "Barcelona",
            "shortName": "BAR",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "homeScore": 1,
        "awayScore": 1,
        "status": "HALFTIME",
        "kickoff": "2026-09-08T19:00:00Z",
        "venue": "Santiago Bernabéu",
        "referee": "Jesús Gil Manzano",
        "matchday": 4
    },
    {
        "id": "match-live-003",
        "competition": {
            "id": "bundesliga",
            "name": "Bundesliga",
            "shortName": "BL",
            "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
            "country": "Germany",
            "type": "league"
        },
        "homeTeam": {
            "id": "bayern-munich",
            "name": "Bayern Munich",
            "shortName": "BAY",
            "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "awayTeam": {
            "id": "borussia-dortmund",
            "name": "Borussia Dortmund",
            "shortName": "BVB",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "homeScore": 2,
        "awayScore": 1,
        "status": "LIVE",
        "kickoff": "2026-09-08T17:30:00Z",
        "venue": "Allianz Arena",
        "referee": "Daniel Siebert",
        "matchday": 3
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/matches/results.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "match-result-001",
        "competition": {
            "id": "premier-league",
            "name": "Premier League",
            "shortName": "PL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "type": "league"
        },
        "homeTeam": {
            "id": "liverpool",
            "name": "Liverpool",
            "shortName": "LIV",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "awayTeam": {
            "id": "manchester-united",
            "name": "Manchester United",
            "shortName": "MUN",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "homeScore": 4,
        "awayScore": 0,
        "status": "FINISHED",
        "kickoff": "2026-09-07T15:00:00Z",
        "venue": "Anfield",
        "referee": "Michael Oliver",
        "matchday": 3
    },
    {
        "id": "match-result-002",
        "competition": {
            "id": "premier-league",
            "name": "Premier League",
            "shortName": "PL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "type": "league"
        },
        "homeTeam": {
            "id": "manchester-city",
            "name": "Manchester City",
            "shortName": "MCI",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "awayTeam": {
            "id": "west-ham",
            "name": "West Ham United",
            "shortName": "WHU",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "homeScore": 3,
        "awayScore": 1,
        "status": "FINISHED",
        "kickoff": "2026-09-07T15:00:00Z",
        "venue": "Etihad Stadium",
        "referee": "Anthony Taylor",
        "matchday": 3
    },
    {
        "id": "match-result-003",
        "competition": {
            "id": "la-liga",
            "name": "La Liga",
            "shortName": "LL",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Spain",
            "type": "league"
        },
        "homeTeam": {
            "id": "barcelona",
            "name": "Barcelona",
            "shortName": "BAR",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "awayTeam": {
            "id": "atletico-madrid",
            "name": "Atlético Madrid",
            "shortName": "ATM",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "homeScore": 2,
        "awayScore": 2,
        "status": "FINISHED",
        "kickoff": "2026-09-07T19:00:00Z",
        "venue": "Spotify Camp Nou",
        "referee": "Ricardo de Burgos Bengoetxea",
        "matchday": 3
    },
    {
        "id": "match-result-004",
        "competition": {
            "id": "serie-a",
            "name": "Serie A",
            "shortName": "SA",
            "logo": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=100&h=100&fit=crop",
            "country": "Italy",
            "type": "league"
        },
        "homeTeam": {
            "id": "inter-milan",
            "name": "Inter Milan",
            "shortName": "INT",
            "logo": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "awayTeam": {
            "id": "ac-milan",
            "name": "AC Milan",
            "shortName": "MIL",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "homeScore": 2,
        "awayScore": 0,
        "status": "FINISHED",
        "kickoff": "2026-09-07T18:45:00Z",
        "venue": "San Siro",
        "referee": "Davide Massa",
        "matchday": 3
    },
    {
        "id": "match-result-005",
        "competition": {
            "id": "bundesliga",
            "name": "Bundesliga",
            "shortName": "BL",
            "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
            "country": "Germany",
            "type": "league"
        },
        "homeTeam": {
            "id": "bayern-munich",
            "name": "Bayern Munich",
            "shortName": "BAY",
            "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "awayTeam": {
            "id": "darmstadt",
            "name": "Darmstadt 98",
            "shortName": "DAR",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "homeScore": 6,
        "awayScore": 0,
        "status": "FINISHED",
        "kickoff": "2026-09-07T17:30:00Z",
        "venue": "Allianz Arena",
        "referee": "Daniel Siebert",
        "matchday": 2
    },
    {
        "id": "match-result-006",
        "competition": {
            "id": "ligue-1",
            "name": "Ligue 1",
            "shortName": "L1",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "France",
            "type": "league"
        },
        "homeTeam": {
            "id": "psg",
            "name": "Paris Saint-Germain",
            "shortName": "PSG",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "France",
            "league": "Ligue 1"
        },
        "awayTeam": {
            "id": "lyon",
            "name": "Olympique Lyon",
            "shortName": "OL",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "France",
            "league": "Ligue 1"
        },
        "homeScore": 4,
        "awayScore": 1,
        "status": "FINISHED",
        "kickoff": "2026-09-07T19:45:00Z",
        "venue": "Parc des Princes",
        "referee": "Clément Turpin",
        "matchday": 3
    },
    {
        "id": "match-result-007",
        "competition": {
            "id": "champions-league",
            "name": "UEFA Champions League",
            "shortName": "UCL",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Europe",
            "type": "cup"
        },
        "homeTeam": {
            "id": "real-madrid",
            "name": "Real Madrid",
            "shortName": "RMA",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "awayTeam": {
            "id": "braga",
            "name": "SC Braga",
            "shortName": "BRA",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Portugal",
            "league": "Primeira Liga"
        },
        "homeScore": 3,
        "awayScore": 0,
        "status": "FINISHED",
        "kickoff": "2026-09-06T19:00:00Z",
        "venue": "Santiago Bernabéu",
        "referee": "Szymon Marciniak",
        "matchday": 1
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/matches/upcoming.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "match-upcoming-001",
        "competition": {
            "id": "premier-league",
            "name": "Premier League",
            "shortName": "PL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "type": "league"
        },
        "homeTeam": {
            "id": "manchester-city",
            "name": "Manchester City",
            "shortName": "MCI",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "awayTeam": {
            "id": "liverpool",
            "name": "Liverpool",
            "shortName": "LIV",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "homeScore": null,
        "awayScore": null,
        "status": "SCHEDULED",
        "kickoff": "2026-09-09T16:30:00Z",
        "venue": "Etihad Stadium",
        "referee": "Anthony Taylor",
        "matchday": 4
    },
    {
        "id": "match-upcoming-002",
        "competition": {
            "id": "premier-league",
            "name": "Premier League",
            "shortName": "PL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "type": "league"
        },
        "homeTeam": {
            "id": "tottenham",
            "name": "Tottenham Hotspur",
            "shortName": "TOT",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "awayTeam": {
            "id": "manchester-united",
            "name": "Manchester United",
            "shortName": "MUN",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "homeScore": null,
        "awayScore": null,
        "status": "SCHEDULED",
        "kickoff": "2026-09-09T14:00:00Z",
        "venue": "Tottenham Hotspur Stadium",
        "referee": "Craig Pawson",
        "matchday": 4
    },
    {
        "id": "match-upcoming-003",
        "competition": {
            "id": "champions-league",
            "name": "UEFA Champions League",
            "shortName": "UCL",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Europe",
            "type": "cup"
        },
        "homeTeam": {
            "id": "psg",
            "name": "Paris Saint-Germain",
            "shortName": "PSG",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "France",
            "league": "Ligue 1"
        },
        "awayTeam": {
            "id": "borussia-dortmund",
            "name": "Borussia Dortmund",
            "shortName": "BVB",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "homeScore": null,
        "awayScore": null,
        "status": "SCHEDULED",
        "kickoff": "2026-09-10T19:00:00Z",
        "venue": "Parc des Princes",
        "referee": "Daniele Orsato",
        "matchday": 1
    },
    {
        "id": "match-upcoming-004",
        "competition": {
            "id": "champions-league",
            "name": "UEFA Champions League",
            "shortName": "UCL",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Europe",
            "type": "cup"
        },
        "homeTeam": {
            "id": "inter-milan",
            "name": "Inter Milan",
            "shortName": "INT",
            "logo": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "awayTeam": {
            "id": "real-madrid",
            "name": "Real Madrid",
            "shortName": "RMA",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "homeScore": null,
        "awayScore": null,
        "status": "SCHEDULED",
        "kickoff": "2026-09-10T19:00:00Z",
        "venue": "San Siro",
        "referee": "Szymon Marciniak",
        "matchday": 1
    },
    {
        "id": "match-upcoming-005",
        "competition": {
            "id": "serie-a",
            "name": "Serie A",
            "shortName": "SA",
            "logo": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=100&h=100&fit=crop",
            "country": "Italy",
            "type": "league"
        },
        "homeTeam": {
            "id": "juventus",
            "name": "Juventus",
            "shortName": "JUV",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "awayTeam": {
            "id": "napoli",
            "name": "Napoli",
            "shortName": "NAP",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "homeScore": null,
        "awayScore": null,
        "status": "SCHEDULED",
        "kickoff": "2026-09-10T18:45:00Z",
        "venue": "Allianz Stadium",
        "referee": "Davide Massa",
        "matchday": 3
    },
    {
        "id": "match-upcoming-006",
        "competition": {
            "id": "premier-league",
            "name": "Premier League",
            "shortName": "PL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "type": "league"
        },
        "homeTeam": {
            "id": "newcastle",
            "name": "Newcastle United",
            "shortName": "NEW",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "awayTeam": {
            "id": "brighton",
            "name": "Brighton & Hove Albion",
            "shortName": "BHA",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "homeScore": null,
        "awayScore": null,
        "status": "SCHEDULED",
        "kickoff": "2026-09-10T13:00:00Z",
        "venue": "St James' Park",
        "referee": "Simon Hooper",
        "matchday": 4
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/news/latest.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "news-001",
        "title": "Arsenal close in on Rice deal as West Ham set £100m asking price",
        "summary": "The Gunners are preparing an improved bid for the England international after seeing their initial offer rejected by the Hammers.",
        "source": "The Athletic",
        "sourceUrl": "https://theathletic.com/football/news/arsenal-rice-bid",
        "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop",
        "category": "Transfers",
        "publishedAt": "2026-09-08T10:30:00Z",
        "relatedTeams": [
            "arsenal",
            "west-ham"
        ],
        "relatedPlayers": [
            "declan-rice"
        ]
    },
    {
        "id": "news-002",
        "title": "Manchester City confirm Haaland contract extension until 2029",
        "summary": "Erling Haaland has signed a new long-term deal at the Etihad Stadium, keeping him at the club for the next five years.",
        "source": "BBC Sport",
        "sourceUrl": "https://bbc.com/sport/football/haaland-extension",
        "image": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop",
        "category": "Premier League",
        "publishedAt": "2026-09-08T09:15:00Z",
        "relatedTeams": [
            "manchester-city"
        ],
        "relatedPlayers": [
            "erling-haaland"
        ]
    },
    {
        "id": "news-003",
        "title": "Real Madrid suffer Champions League blow as Vinicius ruled out for six weeks",
        "summary": "The Brazilian winger picked up a hamstring injury in training and will miss the crucial group stage matches against Napoli and Braga.",
        "source": "Marca",
        "sourceUrl": "https://marca.com/futbol/real-madrid/vinicius-injury",
        "image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=450&fit=crop",
        "category": "Champions League",
        "publishedAt": "2026-09-08T08:45:00Z",
        "relatedTeams": [
            "real-madrid"
        ],
        "relatedPlayers": [
            "vinicius-junior"
        ]
    },
    {
        "id": "news-004",
        "title": "Barcelona eye Premier League defender as Araujo replacement",
        "summary": "Xavi's side are monitoring a £50m rated centre-back with the Uruguayan's future still uncertain amid interest from Bayern Munich.",
        "source": "Sport",
        "sourceUrl": "https://sport.es/futbol/barcelona/defender-target",
        "image": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=450&fit=crop",
        "category": "Transfers",
        "publishedAt": "2026-09-08T07:20:00Z",
        "relatedTeams": [
            "barcelona",
            "bayern-munich"
        ],
        "relatedPlayers": [
            "ronald-araujo"
        ]
    },
    {
        "id": "news-005",
        "title": "Liverpool thrash Manchester United 4-0 at Anfield in dominant display",
        "summary": "Salah, Nunez, and Diaz all scored as the Reds produced a masterclass performance to go top of the Premier League table.",
        "source": "Sky Sports",
        "sourceUrl": "https://skysports.com/football/liverpool-man-utd-report",
        "image": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=800&h=450&fit=crop",
        "category": "Premier League",
        "publishedAt": "2026-09-07T22:00:00Z",
        "relatedTeams": [
            "liverpool",
            "manchester-united"
        ],
        "relatedPlayers": [
            "mohamed-salah",
            "darwin-nunez",
            "luis-diaz"
        ]
    },
    {
        "id": "news-006",
        "title": "Inter Milan secure Serie A title with five games to spare",
        "summary": "Lautaro Martinez's brace against AC Milan in the Derby della Madonnina sealed the Scudetto for Simone Inzaghi's side.",
        "source": "Gazzetta dello Sport",
        "sourceUrl": "https://gazzetta.it/calcio/inter-scudetto",
        "image": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=450&fit=crop",
        "category": "Serie A",
        "publishedAt": "2026-09-07T20:30:00Z",
        "relatedTeams": [
            "inter-milan",
            "ac-milan"
        ],
        "relatedPlayers": [
            "lautaro-martinez"
        ]
    },
    {
        "id": "news-007",
        "title": "Kane breaks Bundesliga scoring record in Bayern's 6-0 win",
        "summary": "Harry Kane became the fastest player to reach 30 goals in a single Bundesliga season as Bayern Munich crushed Darmstadt.",
        "source": "Kicker",
        "sourceUrl": "https://kicker.de/bundesliga/kane-record",
        "image": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=450&fit=crop",
        "category": "Bundesliga",
        "publishedAt": "2026-09-07T18:45:00Z",
        "relatedTeams": [
            "bayern-munich"
        ],
        "relatedPlayers": [
            "harry-kane"
        ]
    },
    {
        "id": "news-008",
        "title": "Mbappe confirms PSG departure at end of season",
        "summary": "The French superstar has informed the club he will not renew his contract and will leave on a free transfer next summer.",
        "source": "L'Equipe",
        "sourceUrl": "https://lequipe.fr/football/mbappe-psg-departure",
        "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop",
        "category": "Transfers",
        "publishedAt": "2026-09-07T16:00:00Z",
        "relatedTeams": [
            "psg"
        ],
        "relatedPlayers": [
            "kylian-mbappe"
        ]
    },
    {
        "id": "news-009",
        "title": "England Euro 2024 squad announced: Rashford and Sancho omitted",
        "summary": "Gareth Southgate has named his 26-man squad for the tournament in Germany, with several high-profile exclusions.",
        "source": "The Guardian",
        "sourceUrl": "https://theguardian.com/football/england-euro-squad",
        "image": "https://images.unsplash.com/photo-1461896836934-2d39d0a94f4d?w=800&h=450&fit=crop",
        "category": "International Football",
        "publishedAt": "2026-09-07T14:00:00Z",
        "relatedTeams": [
            "england"
        ],
        "relatedPlayers": []
    },
    {
        "id": "news-010",
        "title": "Chelsea complete signing of Brighton midfielder Caicedo for £115m",
        "summary": "The Ecuador international becomes the most expensive signing in Premier League history after lengthy negotiations.",
        "source": "Fabrizio Romano",
        "sourceUrl": "https://fabrizioromano.com/chelsea-caicedo-done-deal",
        "image": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=800&h=450&fit=crop",
        "category": "Transfers",
        "publishedAt": "2026-09-07T12:30:00Z",
        "relatedTeams": [
            "chelsea",
            "brighton"
        ],
        "relatedPlayers": [
            "moises-caicedo"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/news/trending.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "trending-001",
        "title": "Messi wins record 8th Ballon d'Or after World Cup triumph",
        "summary": "Lionel Messi has been crowned the world's best player for the eighth time following Argentina's World Cup victory in Qatar.",
        "source": "France Football",
        "sourceUrl": "https://francefootball.fr/ballon-or/messi-2026",
        "image": "https://images.unsplash.com/photo-1587382338103-3c0c4641b75c?w=800&h=450&fit=crop",
        "category": "International Football",
        "publishedAt": "2026-09-06T18:00:00Z",
        "relatedTeams": [
            "inter-miami",
            "argentina"
        ],
        "relatedPlayers": [
            "lionel-messi"
        ]
    },
    {
        "id": "trending-002",
        "title": "Arsenal vs Manchester City: Title showdown preview",
        "summary": "The two title contenders meet at the Emirates in what could be a season-defining match in the Premier League title race.",
        "source": "BBC Sport",
        "sourceUrl": "https://bbc.com/sport/football/arsenal-city-preview",
        "image": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=800&h=450&fit=crop",
        "category": "Premier League",
        "publishedAt": "2026-09-06T15:30:00Z",
        "relatedTeams": [
            "arsenal",
            "manchester-city"
        ],
        "relatedPlayers": []
    },
    {
        "id": "trending-003",
        "title": "Transfer Deadline Day: All the done deals and rumours",
        "summary": "Live updates from the final day of the summer transfer window as clubs scramble to complete their business.",
        "source": "Sky Sports",
        "sourceUrl": "https://skysports.com/transfer-deadline-day-live",
        "image": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=800&h=450&fit=crop",
        "category": "Transfers",
        "publishedAt": "2026-09-06T10:00:00Z",
        "relatedTeams": [],
        "relatedPlayers": []
    },
    {
        "id": "trending-004",
        "title": "Champions League group stage draw: Group of Death confirmed",
        "summary": "Real Madrid, PSG, AC Milan, and Borussia Dortmund drawn together in a blockbuster Group F.",
        "source": "UEFA",
        "sourceUrl": "https://uefa.com/championsleague/draw",
        "image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=450&fit=crop",
        "category": "Champions League",
        "publishedAt": "2026-09-05T19:00:00Z",
        "relatedTeams": [
            "real-madrid",
            "psg",
            "ac-milan",
            "borussia-dortmund"
        ],
        "relatedPlayers": []
    },
    {
        "id": "trending-005",
        "title": "Ronaldo scores 900th career goal in Al-Nassr victory",
        "summary": "The Portuguese legend reached the incredible milestone with a stunning free-kick in the Saudi Pro League.",
        "source": "ESPN",
        "sourceUrl": "https://espn.com/football/ronaldo-900-goals",
        "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop",
        "category": "International Football",
        "publishedAt": "2026-09-05T17:45:00Z",
        "relatedTeams": [
            "al-nassr",
            "portugal"
        ],
        "relatedPlayers": [
            "cristiano-ronaldo"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/teams/teams.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "arsenal",
        "name": "Arsenal",
        "shortName": "ARS",
        "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1886,
        "stadium": "Emirates Stadium",
        "capacity": 60704
    },
    {
        "id": "chelsea",
        "name": "Chelsea",
        "shortName": "CHE",
        "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1905,
        "stadium": "Stamford Bridge",
        "capacity": 40341
    },
    {
        "id": "liverpool",
        "name": "Liverpool",
        "shortName": "LIV",
        "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1892,
        "stadium": "Anfield",
        "capacity": 61276
    },
    {
        "id": "manchester-city",
        "name": "Manchester City",
        "shortName": "MCI",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1880,
        "stadium": "Etihad Stadium",
        "capacity": 55097
    },
    {
        "id": "manchester-united",
        "name": "Manchester United",
        "shortName": "MUN",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1878,
        "stadium": "Old Trafford",
        "capacity": 76212
    },
    {
        "id": "tottenham",
        "name": "Tottenham Hotspur",
        "shortName": "TOT",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1882,
        "stadium": "Tottenham Hotspur Stadium",
        "capacity": 62850
    },
    {
        "id": "newcastle",
        "name": "Newcastle United",
        "shortName": "NEW",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1892,
        "stadium": "St James' Park",
        "capacity": 52305
    },
    {
        "id": "brighton",
        "name": "Brighton & Hove Albion",
        "shortName": "BHA",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1901,
        "stadium": "Amex Stadium",
        "capacity": 31872
    },
    {
        "id": "west-ham",
        "name": "West Ham United",
        "shortName": "WHU",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "England",
        "league": "Premier League",
        "founded": 1895,
        "stadium": "London Stadium",
        "capacity": 60000
    },
    {
        "id": "real-madrid",
        "name": "Real Madrid",
        "shortName": "RMA",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Spain",
        "league": "La Liga",
        "founded": 1902,
        "stadium": "Santiago Bernabéu",
        "capacity": 83186
    },
    {
        "id": "barcelona",
        "name": "Barcelona",
        "shortName": "BAR",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "Spain",
        "league": "La Liga",
        "founded": 1899,
        "stadium": "Spotify Camp Nou",
        "capacity": 99354
    },
    {
        "id": "atletico-madrid",
        "name": "Atlético Madrid",
        "shortName": "ATM",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Spain",
        "league": "La Liga",
        "founded": 1903,
        "stadium": "Metropolitano Stadium",
        "capacity": 70460
    },
    {
        "id": "bayern-munich",
        "name": "Bayern Munich",
        "shortName": "BAY",
        "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
        "country": "Germany",
        "league": "Bundesliga",
        "founded": 1900,
        "stadium": "Allianz Arena",
        "capacity": 75024
    },
    {
        "id": "borussia-dortmund",
        "name": "Borussia Dortmund",
        "shortName": "BVB",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "Germany",
        "league": "Bundesliga",
        "founded": 1909,
        "stadium": "Signal Iduna Park",
        "capacity": 81365
    },
    {
        "id": "rb-leipzig",
        "name": "RB Leipzig",
        "shortName": "RBL",
        "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
        "country": "Germany",
        "league": "Bundesliga",
        "founded": 2009,
        "stadium": "Red Bull Arena",
        "capacity": 47069
    },
    {
        "id": "inter-milan",
        "name": "Inter Milan",
        "shortName": "INT",
        "logo": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=100&h=100&fit=crop",
        "country": "Italy",
        "league": "Serie A",
        "founded": 1908,
        "stadium": "San Siro",
        "capacity": 80018
    },
    {
        "id": "ac-milan",
        "name": "AC Milan",
        "shortName": "MIL",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Italy",
        "league": "Serie A",
        "founded": 1899,
        "stadium": "San Siro",
        "capacity": 80018
    },
    {
        "id": "juventus",
        "name": "Juventus",
        "shortName": "JUV",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "Italy",
        "league": "Serie A",
        "founded": 1897,
        "stadium": "Allianz Stadium",
        "capacity": 41507
    },
    {
        "id": "napoli",
        "name": "Napoli",
        "shortName": "NAP",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "Italy",
        "league": "Serie A",
        "founded": 1926,
        "stadium": "Stadio Diego Armando Maradona",
        "capacity": 54726
    },
    {
        "id": "atalanta",
        "name": "Atalanta",
        "shortName": "ATA",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "Italy",
        "league": "Serie A",
        "founded": 1907,
        "stadium": "Gewiss Stadium",
        "capacity": 23940
    },
    {
        "id": "psg",
        "name": "Paris Saint-Germain",
        "shortName": "PSG",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "France",
        "league": "Ligue 1",
        "founded": 1970,
        "stadium": "Parc des Princes",
        "capacity": 47929
    },
    {
        "id": "ajax",
        "name": "Ajax",
        "shortName": "AJA",
        "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
        "country": "Netherlands",
        "league": "Eredivisie",
        "founded": 1900,
        "stadium": "Johan Cruijff ArenA",
        "capacity": 55865
    },
    {
        "id": "villarreal",
        "name": "Villarreal",
        "shortName": "VIL",
        "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
        "country": "Spain",
        "league": "La Liga",
        "founded": 1923,
        "stadium": "Estadio de la Cerámica",
        "capacity": 23500
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/transfers/confirmed.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "confirmed-001",
        "player": {
            "id": "player-009",
            "name": "Declan Rice",
            "position": "Defensive Midfielder",
            "age": 24,
            "nationality": "England",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "arsenal"
        },
        "fromClub": {
            "id": "west-ham",
            "name": "West Ham United",
            "shortName": "WHU",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "toClub": {
            "id": "arsenal",
            "name": "Arsenal",
            "shortName": "ARS",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 105000000,
        "source": "Arsenal Official",
        "reliability": 100,
        "updatedAt": "2026-07-15T10:00:00Z"
    },
    {
        "id": "confirmed-002",
        "player": {
            "id": "player-010",
            "name": "Kai Havertz",
            "position": "Forward",
            "age": 24,
            "nationality": "Germany",
            "image": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "arsenal"
        },
        "fromClub": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "toClub": {
            "id": "arsenal",
            "name": "Arsenal",
            "shortName": "ARS",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 65000000,
        "source": "Arsenal Official",
        "reliability": 100,
        "updatedAt": "2026-06-28T14:00:00Z"
    },
    {
        "id": "confirmed-003",
        "player": {
            "id": "player-011",
            "name": "Jurrien Timber",
            "position": "Centre-Back",
            "age": 22,
            "nationality": "Netherlands",
            "image": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "arsenal"
        },
        "fromClub": {
            "id": "ajax",
            "name": "Ajax",
            "shortName": "AJA",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Netherlands",
            "league": "Eredivisie"
        },
        "toClub": {
            "id": "arsenal",
            "name": "Arsenal",
            "shortName": "ARS",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 40000000,
        "source": "Arsenal Official",
        "reliability": 100,
        "updatedAt": "2026-07-14T12:00:00Z"
    },
    {
        "id": "confirmed-004",
        "player": {
            "id": "player-012",
            "name": "Christopher Nkunku",
            "position": "Forward",
            "age": 25,
            "nationality": "France",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "chelsea"
        },
        "fromClub": {
            "id": "rb-leipzig",
            "name": "RB Leipzig",
            "shortName": "RBL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "toClub": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 52000000,
        "source": "Chelsea Official",
        "reliability": 100,
        "updatedAt": "2026-06-20T16:00:00Z"
    },
    {
        "id": "confirmed-005",
        "player": {
            "id": "player-013",
            "name": "Nicolas Jackson",
            "position": "Striker",
            "age": 22,
            "nationality": "Senegal",
            "image": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "chelsea"
        },
        "fromClub": {
            "id": "villarreal",
            "name": "Villarreal",
            "shortName": "VIL",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "toClub": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 35000000,
        "source": "Chelsea Official",
        "reliability": 100,
        "updatedAt": "2026-07-01T11:00:00Z"
    },
    {
        "id": "confirmed-006",
        "player": {
            "id": "player-014",
            "name": "Sandro Tonali",
            "position": "Midfielder",
            "age": 23,
            "nationality": "Italy",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "newcastle"
        },
        "fromClub": {
            "id": "ac-milan",
            "name": "AC Milan",
            "shortName": "MIL",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "toClub": {
            "id": "newcastle",
            "name": "Newcastle United",
            "shortName": "NEW",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 64000000,
        "source": "Newcastle Official",
        "reliability": 100,
        "updatedAt": "2026-07-03T10:00:00Z"
    },
    {
        "id": "confirmed-007",
        "player": {
            "id": "player-015",
            "name": "Dominik Szoboszlai",
            "position": "Midfielder",
            "age": 22,
            "nationality": "Hungary",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "liverpool"
        },
        "fromClub": {
            "id": "rb-leipzig",
            "name": "RB Leipzig",
            "shortName": "RBL",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "toClub": {
            "id": "liverpool",
            "name": "Liverpool",
            "shortName": "LIV",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 60000000,
        "source": "Liverpool Official",
        "reliability": 100,
        "updatedAt": "2026-07-02T14:00:00Z"
    },
    {
        "id": "confirmed-008",
        "player": {
            "id": "player-016",
            "name": "Alexis Mac Allister",
            "position": "Midfielder",
            "age": 24,
            "nationality": "Argentina",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "liverpool"
        },
        "fromClub": {
            "id": "brighton",
            "name": "Brighton & Hove Albion",
            "shortName": "BHA",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "toClub": {
            "id": "liverpool",
            "name": "Liverpool",
            "shortName": "LIV",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 35000000,
        "source": "Liverpool Official",
        "reliability": 100,
        "updatedAt": "2026-06-08T12:00:00Z"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/transfers/rumours.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "transfer-001",
        "player": {
            "id": "player-001",
            "name": "Victor Osimhen",
            "position": "Striker",
            "age": 25,
            "nationality": "Nigeria",
            "image": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "napoli"
        },
        "fromClub": {
            "id": "napoli",
            "name": "Napoli",
            "shortName": "NAP",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "toClub": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Advanced",
        "fee": 120000000,
        "source": "Fabrizio Romano",
        "reliability": 85,
        "updatedAt": "2026-09-08T11:00:00Z"
    },
    {
        "id": "transfer-002",
        "player": {
            "id": "player-002",
            "name": "Kylian Mbappé",
            "position": "Forward",
            "age": 25,
            "nationality": "France",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "psg"
        },
        "fromClub": {
            "id": "psg",
            "name": "Paris Saint-Germain",
            "shortName": "PSG",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "France",
            "league": "Ligue 1"
        },
        "toClub": {
            "id": "real-madrid",
            "name": "Real Madrid",
            "shortName": "RMA",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "status": "Negotiating",
        "fee": null,
        "source": "Marca",
        "reliability": 90,
        "updatedAt": "2026-09-08T10:30:00Z"
    },
    {
        "id": "transfer-003",
        "player": {
            "id": "player-003",
            "name": "Jude Bellingham",
            "position": "Midfielder",
            "age": 20,
            "nationality": "England",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "borussia-dortmund"
        },
        "fromClub": {
            "id": "borussia-dortmund",
            "name": "Borussia Dortmund",
            "shortName": "BVB",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "toClub": {
            "id": "real-madrid",
            "name": "Real Madrid",
            "shortName": "RMA",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "status": "Confirmed",
        "fee": 103000000,
        "source": "Real Madrid Official",
        "reliability": 100,
        "updatedAt": "2026-09-07T18:00:00Z"
    },
    {
        "id": "transfer-004",
        "player": {
            "id": "player-004",
            "name": "Harry Kane",
            "position": "Striker",
            "age": 30,
            "nationality": "England",
            "image": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "tottenham"
        },
        "fromClub": {
            "id": "tottenham",
            "name": "Tottenham Hotspur",
            "shortName": "TOT",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "toClub": {
            "id": "bayern-munich",
            "name": "Bayern Munich",
            "shortName": "BAY",
            "logo": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
            "country": "Germany",
            "league": "Bundesliga"
        },
        "status": "Completed",
        "fee": 100000000,
        "source": "Bayern Munich Official",
        "reliability": 100,
        "updatedAt": "2026-09-07T12:00:00Z"
    },
    {
        "id": "transfer-005",
        "player": {
            "id": "player-005",
            "name": "Mason Mount",
            "position": "Midfielder",
            "age": 24,
            "nationality": "England",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "chelsea"
        },
        "fromClub": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "toClub": {
            "id": "manchester-united",
            "name": "Manchester United",
            "shortName": "MUN",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 60000000,
        "source": "Manchester United Official",
        "reliability": 100,
        "updatedAt": "2026-09-06T16:00:00Z"
    },
    {
        "id": "transfer-006",
        "player": {
            "id": "player-006",
            "name": "João Félix",
            "position": "Forward",
            "age": 23,
            "nationality": "Portugal",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "atletico-madrid"
        },
        "fromClub": {
            "id": "atletico-madrid",
            "name": "Atlético Madrid",
            "shortName": "ATM",
            "logo": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "toClub": {
            "id": "barcelona",
            "name": "Barcelona",
            "shortName": "BAR",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Spain",
            "league": "La Liga"
        },
        "status": "Rumour",
        "fee": null,
        "source": "Mundo Deportivo",
        "reliability": 65,
        "updatedAt": "2026-09-08T09:00:00Z"
    },
    {
        "id": "transfer-007",
        "player": {
            "id": "player-007",
            "name": "Rasmus Højlund",
            "position": "Striker",
            "age": 20,
            "nationality": "Denmark",
            "image": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "atalanta"
        },
        "fromClub": {
            "id": "atalanta",
            "name": "Atalanta",
            "shortName": "ATA",
            "logo": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
            "country": "Italy",
            "league": "Serie A"
        },
        "toClub": {
            "id": "manchester-united",
            "name": "Manchester United",
            "shortName": "MUN",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 72000000,
        "source": "Manchester United Official",
        "reliability": 100,
        "updatedAt": "2026-09-05T14:00:00Z"
    },
    {
        "id": "transfer-008",
        "player": {
            "id": "player-008",
            "name": "Moises Caicedo",
            "position": "Midfielder",
            "age": 21,
            "nationality": "Ecuador",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop&crop=face",
            "currentTeamId": "brighton"
        },
        "fromClub": {
            "id": "brighton",
            "name": "Brighton & Hove Albion",
            "shortName": "BHA",
            "logo": "https://images.unsplash.com/photo-1552664456-8f3e851c8d16?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "toClub": {
            "id": "chelsea",
            "name": "Chelsea",
            "shortName": "CHE",
            "logo": "https://images.unsplash.com/photo-1607311206758-3520f88c19a6?w=100&h=100&fit=crop",
            "country": "England",
            "league": "Premier League"
        },
        "status": "Completed",
        "fee": 115000000,
        "source": "Chelsea Official",
        "reliability": 100,
        "updatedAt": "2026-09-07T12:30:00Z"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/competitions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllCompetitions",
    ()=>getAllCompetitions,
    "getCompetitionById",
    ()=>getCompetitionById,
    "getCompetitionsByCountry",
    ()=>getCompetitionsByCountry,
    "getCompetitionsByType",
    ()=>getCompetitionsByType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schemas/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$competitions$2f$competitions$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/competitions/competitions.json.[json].cjs [app-client] (ecmascript)");
;
;
async function getAllCompetitions() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompetitionSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$competitions$2f$competitions$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getCompetitionById(id) {
    const competitions = await getAllCompetitions();
    return competitions.find((comp)=>comp.id === id) || null;
}
async function getCompetitionsByType(type) {
    const competitions = await getAllCompetitions();
    return competitions.filter((comp)=>comp.type === type);
}
async function getCompetitionsByCountry(country) {
    const competitions = await getAllCompetitions();
    return competitions.filter((comp)=>comp.country === country);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/news.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$transfers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/transfers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$matches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/matches.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$teams$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/teams.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$competitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/competitions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$search$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/search.ts [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/matches.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllMatches",
    ()=>getAllMatches,
    "getLiveMatches",
    ()=>getLiveMatches,
    "getMatchById",
    ()=>getMatchById,
    "getMatchesByCompetition",
    ()=>getMatchesByCompetition,
    "getMatchesByDateRange",
    ()=>getMatchesByDateRange,
    "getMatchesByStatus",
    ()=>getMatchesByStatus,
    "getMatchesByTeam",
    ()=>getMatchesByTeam,
    "getRecentResults",
    ()=>getRecentResults,
    "getUpcomingMatches",
    ()=>getUpcomingMatches
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schemas/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$matches$2f$live$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/matches/live.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$matches$2f$upcoming$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/matches/upcoming.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$matches$2f$results$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/matches/results.json.[json].cjs [app-client] (ecmascript)");
;
;
;
;
async function getLiveMatches() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MatchSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$matches$2f$live$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getUpcomingMatches() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MatchSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$matches$2f$upcoming$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getRecentResults() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MatchSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$matches$2f$results$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getAllMatches() {
    const [live, upcoming, results] = await Promise.all([
        getLiveMatches(),
        getUpcomingMatches(),
        getRecentResults()
    ]);
    return [
        ...live,
        ...upcoming,
        ...results
    ].sort((a, b)=>new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());
}
async function getMatchesByStatus(status) {
    const allMatches = await getAllMatches();
    return allMatches.filter((match)=>match.status === status);
}
async function getMatchesByCompetition(competitionId) {
    const allMatches = await getAllMatches();
    return allMatches.filter((match)=>match.competition.id === competitionId);
}
async function getMatchesByTeam(teamId) {
    const allMatches = await getAllMatches();
    return allMatches.filter((match)=>match.homeTeam.id === teamId || match.awayTeam.id === teamId);
}
async function getMatchesByDateRange(startDate, endDate) {
    const allMatches = await getAllMatches();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return allMatches.filter((match)=>{
        const kickoff = new Date(match.kickoff).getTime();
        return kickoff >= start && kickoff <= end;
    });
}
async function getMatchById(id) {
    const allMatches = await getAllMatches();
    return allMatches.find((match)=>match.id === id) || null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/news.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFeaturedNews",
    ()=>getFeaturedNews,
    "getLatestNews",
    ()=>getLatestNews,
    "getNewsByCategory",
    ()=>getNewsByCategory,
    "getNewsById",
    ()=>getNewsById,
    "getTrendingNews",
    ()=>getTrendingNews,
    "searchNews",
    ()=>searchNews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schemas/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$news$2f$latest$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/news/latest.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$news$2f$trending$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/news/trending.json.[json].cjs [app-client] (ecmascript)");
;
;
;
async function getLatestNews() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NewsArticleSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$news$2f$latest$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getTrendingNews() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NewsArticleSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$news$2f$trending$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getNewsByCategory(category) {
    const allNews = await getLatestNews();
    return allNews.filter((article)=>article.category === category);
}
async function getNewsById(id) {
    const allNews = await getLatestNews();
    return allNews.find((article)=>article.id === id) || null;
}
async function getFeaturedNews() {
    const allNews = await getLatestNews();
    return allNews[0] || null;
}
async function searchNews(query) {
    const allNews = await getLatestNews();
    const lowerQuery = query.toLowerCase();
    return allNews.filter((article)=>article.title.toLowerCase().includes(lowerQuery) || article.summary.toLowerCase().includes(lowerQuery) || article.source.toLowerCase().includes(lowerQuery));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/search.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "globalSearch",
    ()=>globalSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/news.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$transfers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/transfers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$teams$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/teams.ts [app-client] (ecmascript)");
;
;
;
async function globalSearch(query) {
    if (!query.trim()) {
        return [];
    }
    const [teams, news, transfers] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$teams$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchTeams"])(query),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchNews"])(query),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$transfers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchTransfers"])(query)
    ]);
    const results = [];
    if (teams.length > 0) {
        results.push({
            type: 'teams',
            items: teams
        });
    }
    if (news.length > 0) {
        results.push({
            type: 'news',
            items: news
        });
    }
    if (transfers.length > 0) {
        results.push({
            type: 'transfers',
            items: transfers
        });
    }
    return results;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/teams.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllTeams",
    ()=>getAllTeams,
    "getTeamById",
    ()=>getTeamById,
    "getTeamsByCountry",
    ()=>getTeamsByCountry,
    "getTeamsByLeague",
    ()=>getTeamsByLeague,
    "searchTeams",
    ()=>searchTeams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schemas/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$teams$2f$teams$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/teams/teams.json.[json].cjs [app-client] (ecmascript)");
;
;
async function getAllTeams() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TeamSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$teams$2f$teams$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getTeamById(id) {
    const teams = await getAllTeams();
    return teams.find((team)=>team.id === id) || null;
}
async function getTeamsByLeague(league) {
    const teams = await getAllTeams();
    return teams.filter((team)=>team.league === league);
}
async function getTeamsByCountry(country) {
    const teams = await getAllTeams();
    return teams.filter((team)=>team.country === country);
}
async function searchTeams(query) {
    const teams = await getAllTeams();
    const lowerQuery = query.toLowerCase();
    return teams.filter((team)=>team.name.toLowerCase().includes(lowerQuery) || team.shortName.toLowerCase().includes(lowerQuery));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/transfers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllTransfers",
    ()=>getAllTransfers,
    "getConfirmedTransfers",
    ()=>getConfirmedTransfers,
    "getTransferRumours",
    ()=>getTransferRumours,
    "getTransfersByClub",
    ()=>getTransfersByClub,
    "getTransfersByPlayer",
    ()=>getTransfersByPlayer,
    "getTransfersByStatus",
    ()=>getTransfersByStatus,
    "searchTransfers",
    ()=>searchTransfers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schemas/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$transfers$2f$rumours$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/transfers/rumours.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$transfers$2f$confirmed$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/transfers/confirmed.json.[json].cjs [app-client] (ecmascript)");
;
;
;
async function getTransferRumours() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$transfers$2f$rumours$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getConfirmedTransfers() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateData"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferSchema"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$transfers$2f$confirmed$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
async function getAllTransfers() {
    const [rumours, confirmed] = await Promise.all([
        getTransferRumours(),
        getConfirmedTransfers()
    ]);
    return [
        ...rumours,
        ...confirmed
    ].sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
async function getTransfersByStatus(status) {
    const allTransfers = await getAllTransfers();
    return allTransfers.filter((transfer)=>transfer.status === status);
}
async function getTransfersByPlayer(playerId) {
    const allTransfers = await getAllTransfers();
    return allTransfers.filter((transfer)=>transfer.player.id === playerId);
}
async function getTransfersByClub(clubId) {
    const allTransfers = await getAllTransfers();
    return allTransfers.filter((transfer)=>transfer.fromClub.id === clubId || transfer.toClub?.id === clubId);
}
async function searchTransfers(query) {
    const allTransfers = await getAllTransfers();
    const lowerQuery = query.toLowerCase();
    return allTransfers.filter((transfer)=>transfer.player.name.toLowerCase().includes(lowerQuery) || transfer.fromClub.name.toLowerCase().includes(lowerQuery) || transfer.toClub?.name.toLowerCase().includes(lowerQuery) || transfer.source.toLowerCase().includes(lowerQuery));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/schemas/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompetitionSchema",
    ()=>CompetitionSchema,
    "MatchSchema",
    ()=>MatchSchema,
    "NewsArticleSchema",
    ()=>NewsArticleSchema,
    "PlayerSchema",
    ()=>PlayerSchema,
    "TeamSchema",
    ()=>TeamSchema,
    "TransferSchema",
    ()=>TransferSchema,
    "validateData",
    ()=>validateData,
    "validateSingle",
    ()=>validateSingle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const TeamSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    shortName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    logo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    country: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    league: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    founded: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    stadium: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    capacity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
});
const PlayerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    position: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    age: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    nationality: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    currentTeamId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const CompetitionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    shortName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    logo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    country: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'league',
        'cup',
        'international'
    ])
});
const NewsArticleSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    sourceUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Transfers',
        'Premier League',
        'Champions League',
        'La Liga',
        'Serie A',
        'Bundesliga',
        'Ligue 1',
        'International Football'
    ]),
    publishedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime(),
    relatedTeams: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    relatedPlayers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const TransferSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    player: PlayerSchema,
    fromClub: TeamSchema,
    toClub: TeamSchema.nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Rumour',
        'Advanced',
        'Negotiating',
        'Confirmed',
        'Completed'
    ]),
    fee: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nullable(),
    source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    reliability: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(100),
    updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime()
});
const MatchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    competition: CompetitionSchema,
    homeTeam: TeamSchema,
    awayTeam: TeamSchema,
    homeScore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nullable(),
    awayScore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'SCHEDULED',
        'LIVE',
        'HALFTIME',
        'FINISHED',
        'POSTPONED',
        'CANCELLED'
    ]),
    kickoff: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime(),
    venue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    referee: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    matchday: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
});
function validateData(schema, data) {
    if (!Array.isArray(data)) {
        console.error('Expected array, got:', typeof data);
        return [];
    }
    const validItems = [];
    const errors = [];
    for (const item of data){
        const result = schema.safeParse(item);
        if (result.success) {
            validItems.push(result.data);
        } else {
            errors.push(result.error);
            console.warn('Validation failed for item:', item);
        }
    }
    if (errors.length > 0) {
        console.error(`${errors.length} items failed validation`);
    }
    return validItems;
}
function validateSingle(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return result.data;
    }
    console.error('Validation failed:', result.error);
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_201h096._.js.map