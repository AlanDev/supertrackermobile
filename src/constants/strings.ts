export const STRINGS = {
  // App general
  app: {
    name: 'SuperTracker',
    tagline: 'Tu comparador de precios',
    version: '1.0.0',
  },

  // Navigation
  nav: {
    home: 'Inicio',
    products: 'Productos',
    lists: 'Listas',
    offers: 'Ofertas',
    statistics: 'Estadísticas',
    history: 'Historial',
    profile: 'Perfil',
    settings: 'Configuración',
  },

  // Authentication
  auth: {
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    name: 'Nombre Completo',
    forgotPassword: 'Olvidé mi contraseña',
    dontHaveAccount: '¿No tienes cuenta?',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
  },

  // Shopping Lists
  lists: {
    title: 'Listas de Compras',
    newList: 'Nueva Lista',
    addProduct: 'Agregar Producto',
    editList: 'Editar Lista',
    deleteList: 'Eliminar Lista',
    completeList: 'Completar Lista',
    emptyList: 'Lista vacía',
    addFirstProduct: 'Agrega tu primer producto',
  },

  // Products
  products: {
    title: 'Productos',
    search: 'Buscar productos...',
    category: 'Categoría',
    price: 'Precio',
    stock: 'Stock',
    addToList: 'Agregar a lista',
    compare: 'Comparar precios',
    noResults: 'No se encontraron productos',
  },

  // Offers
  offers: {
    title: 'Ofertas y Descuentos',
    featured: 'Destacadas',
    category: 'Por categoría',
    expiring: 'Por vencer',
    discount: 'Descuento',
    validUntil: 'Válido hasta',
    seeDetails: 'Ver detalles',
  },

  // Common actions
  actions: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    confirm: 'Confirmar',
    continue: 'Continuar',
    back: 'Volver',
    close: 'Cerrar',
    refresh: 'Actualizar',
  },

  // Messages
  messages: {
    success: 'Operación exitosa',
    error: 'Ocurrió un error',
    loading: 'Cargando...',
    noData: 'No hay datos disponibles',
    noInternet: 'Sin conexión a internet',
    tryAgain: 'Intentar nuevamente',
  },

  // Terms and Privacy
  legal: {
    terms: 'Términos y Condiciones',
    privacy: 'Política de Privacidad',
    acceptTerms: 'Acepto los términos y condiciones',
    lastUpdated: 'Última actualización',
  },

  // Storage keys
  storage: {
    userEmail: 'user_email',
    termsAccepted: 'terms_accepted',
    shoppingLists: 'shopping_lists',
    userPreferences: 'user_preferences',
    appSettings: 'app_settings',
  },
};

export const STORAGE_KEYS = STRINGS.storage;

export default STRINGS; 