const ApiUrlServices = {
    SIGN_UP: "signup",
    SIGN_IN: "login",
    LOG_OUT: "logout",
    // product api
    ALL_PRODUCT_LIST: "products",
    ADD_PRODUCT: "products",
    SINGLE_PRODUCT_DETAILS: (id) => `products/${id}`,
    DELETE_PRODUCT: (id) => `/products/${id}`,
    UPDATE_PRODUCT: (id) => `/products/${id}`,
    // categories api
    ALL_CATEGORIES: "categories",
    ADD_CATEGORIES: "categories",
    UPDATE_CATEGORIES: (id) => `/categories/${id}`,
    DELETE_CATEGORIES: (id) => `/categories/${id}`,
    // cart api
    ALL_CART_LIST: "cart",
    ADD_CART: "cart",
    UPDATE_CART: (id) => `/cart/${id}`,
    DELETE_CART: (id) => `/cart/${id}`,
    // wishlist api
    ALL_WISHLIST_LIST: "wishlist",
    ADD_WISHLIST: "wishlist",
    DELETE_WISHLIST: (id) => `/wishlist/${id}`,
    // collection api
    All_COLLECTION: "collections",
    TITLE_COLLECTION: (slug) => `collections/${slug}`,
    // Order Management APIs
    ALL_ORDERS: "admin/orders",
    SINGLE_ORDER_DETAILS: (id) => `admin/orders/${id}`,
    UPDATE_ORDER_STATUS: (id) => `orders/${id}/status`,
    PLACE_ORDER: "orders", // POST to create new order
    
    // Additional useful endpoints (if you want to add later)
    ORDER_ANALYTICS: "orders/analytics",
    ORDER_EXPORT: "orders/export",
    ORDER_SEARCH: "orders/search",
}
export default ApiUrlServices