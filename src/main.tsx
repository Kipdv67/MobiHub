import { useMemo, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleUserRound,
  Download,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Menu,
  Minus,
  Package,
  Plus,
  BookOpen,
  ReceiptText,
  Search,
  Scale,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Star,
  Phone,
  Tag,
  Trash2,
  Truck,
  Users,
  X,
  Clock3,
} from 'lucide-react'
import './styles.css'

type Product = {
  id: number
  name: string
  brand: string
  price: number
  oldPrice: number
  category: string
  badge?: string
  rating: number
  stock: number
  image: string
  colors: string[]
  specifications?: string
}

type CartItem = {
  product: Product
  quantity: number
}

type ProductSort = 'recommended' | 'price-asc' | 'price-desc' | 'rating'

type Review = {
  id: string
  productId: number
  name: string
  rating: number
  comment: string
  date: string
}

type Article = {
  id: number
  category: string
  title: string
  excerpt: string
  readTime: string
  image: string
  content: string[]
}

type StoreLocation = {
  id: number
  city: string
  name: string
  address: string
  hours: string
  phone: string
}

type SupportRequest = {
  id: string
  name: string
  contact: string
  message: string
  createdAt: string
}

type Order = {
  id: string
  customer: string
  phone: string
  address: string
  payment: CheckoutPayload['payment']
  item: string
  items: Array<{ name: string; price: number; quantity?: number }>
  amount: number
  status: 'Đang xử lý' | 'Đang giao' | 'Hoàn tất'
  time: string
  subtotal?: number
  discount?: number
  promoCode?: string
  fulfillment?: 'Giao hàng' | 'Nhận tại cửa hàng'
  pickupStore?: string
}

type CheckoutPayload = {
  customer: string
  phone: string
  address: string
  payment: 'COD' | 'Momo' | 'Banking' | 'Card'
  promoCode: string
  discount: number
  fulfillment: 'Giao hàng' | 'Nhận tại cửa hàng'
  pickupStore: string
}

type Customer = {
  name: string
  phone: string
  email: string
  password: string
}

type AdminAccount = {
  name: string
  email: string
  password: string
}

const seedProducts: Product[] = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB', brand: 'Apple', price: 28990000, oldPrice: 34990000, category: 'iPhone', badge: 'Giảm 17%', rating: 4.9, stock: 12, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=700&q=85', colors: ['#1b2733', '#e5e0d8'] },
  { id: 2, name: 'Galaxy S24 Ultra 5G 256GB', brand: 'Samsung', price: 23990000, oldPrice: 33990000, category: 'Samsung', badge: 'Giảm 29%', rating: 4.8, stock: 8, image: 'https://images.unsplash.com/photo-1707230750324-7e7c89a76b28?auto=format&fit=crop&w=700&q=85', colors: ['#7d8792', '#272a42'] },
  { id: 3, name: 'Xiaomi 14T Pro 5G 512GB', brand: 'Xiaomi', price: 13990000, oldPrice: 17990000, category: 'Xiaomi', badge: 'Mới về', rating: 4.7, stock: 21, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=85', colors: ['#d8d5ce', '#101112'] },
  { id: 4, name: 'OPPO Reno12 Pro 5G', brand: 'OPPO', price: 12990000, oldPrice: 14990000, category: 'OPPO', badge: 'Hot', rating: 4.6, stock: 15, image: 'https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=700&q=85', colors: ['#d6c5ef', '#1c1c22'] },
  { id: 5, name: 'iPad Air M2 11 inch WiFi', brand: 'Apple', price: 16490000, oldPrice: 17990000, category: 'Tablet', rating: 4.8, stock: 6, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=85', colors: ['#bac9d5', '#d8d8d8'] },
  { id: 6, name: 'MacBook Air M3 13 inch', brand: 'Apple', price: 24990000, oldPrice: 27990000, category: 'Laptop', badge: 'Trả góp 0%', rating: 4.9, stock: 4, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=85', colors: ['#b7b9bb', '#eee'] },
  { id: 7, name: 'Tai nghe không dây AirPods Pro 2', brand: 'Apple', price: 5490000, oldPrice: 6190000, category: 'Tai nghe', badge: 'Giảm 11%', rating: 4.9, stock: 18, image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=85', colors: ['#f5f5f5'] },
  { id: 8, name: 'Tai nghe Bluetooth Sony WH-CH520', brand: 'Sony', price: 1190000, oldPrice: 1490000, category: 'Tai nghe', badge: 'Bán chạy', rating: 4.8, stock: 25, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85', colors: ['#20242a', '#f0f0f0'] },
  { id: 9, name: 'Tai nghe chụp tai JBL Tune 520BT', brand: 'JBL', price: 1290000, oldPrice: 1590000, category: 'Tai nghe', rating: 4.7, stock: 14, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85', colors: ['#20242a', '#3153a4'] },
  { id: 10, name: 'Tai nghe có dây Apple EarPods USB-C', brand: 'Apple', price: 549000, oldPrice: 590000, category: 'Tai nghe có dây', badge: 'Chính hãng', rating: 4.8, stock: 32, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=700&q=85', colors: ['#f5f5f5'] },
  { id: 11, name: 'Tai nghe có dây Xiaomi Mi In-Ear', brand: 'Xiaomi', price: 249000, oldPrice: 299000, category: 'Tai nghe có dây', rating: 4.6, stock: 40, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=85', colors: ['#20242a', '#f5f5f5'] },
  { id: 12, name: 'Pin sạc dự phòng Anker 10.000mAh', brand: 'Anker', price: 890000, oldPrice: 1090000, category: 'Sạc dự phòng', badge: 'Sạc nhanh', rating: 4.8, stock: 20, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=700&q=85', colors: ['#20242a', '#e6e8eb'] },
  { id: 13, name: 'Pin sạc dự phòng Baseus 20.000mAh', brand: 'Baseus', price: 690000, oldPrice: 850000, category: 'Sạc dự phòng', rating: 4.7, stock: 16, image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=700&q=85', colors: ['#20242a', '#f5f5f5'] },
]

const accessoryProducts = seedProducts.filter((product) => product.id >= 7)
const accessoryMigrationKey = 'mobihub-accessories-seeded'

const promoOffers = [
  { code: 'MOBI10', title: 'Giảm 10%', description: 'Giảm 10% đơn từ 2.000.000đ, tối đa 500.000đ.' },
  { code: 'TECH100', title: 'Giảm 100.000đ', description: 'Ưu đãi 100.000đ cho đơn từ 5.000.000đ.' },
]

const demoStores: StoreLocation[] = [
  { id: 1, city: 'TP. Hồ Chí Minh', name: 'MobiHub Demo - Quận 1', address: 'Địa chỉ minh họa: đường Nguyễn Huệ, Quận 1', hours: '09:00 - 21:00', phone: 'Chưa thiết lập' },
  { id: 2, city: 'Hà Nội', name: 'MobiHub Demo - Cầu Giấy', address: 'Địa chỉ minh họa: đường Cầu Giấy, quận Cầu Giấy', hours: '09:00 - 21:00', phone: 'Chưa thiết lập' },
  { id: 3, city: 'Đà Nẵng', name: 'MobiHub Demo - Hải Châu', address: 'Địa chỉ minh họa: đường Nguyễn Văn Linh, quận Hải Châu', hours: '09:00 - 21:00', phone: 'Chưa thiết lập' },
]

const articles: Article[] = [
  {
    id: 1,
    category: 'Mẹo công nghệ',
    title: '5 điều nên kiểm tra trước khi chọn mua điện thoại mới',
    excerpt: 'Từ nhu cầu sử dụng đến dung lượng pin, một checklist nhỏ giúp bạn chọn thiết bị phù hợp hơn.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=85',
    content: [
      'Bắt đầu từ nhu cầu thực tế: chụp ảnh, chơi game, làm việc hay liên lạc cơ bản. Việc xác định ưu tiên giúp bạn chọn đúng cấu hình mà không phải trả thêm cho tính năng ít dùng.',
      'Hãy cân nhắc dung lượng lưu trữ, thời lượng pin, kích thước màn hình và thời gian hỗ trợ phần mềm. Nếu có thể, hãy trải nghiệm máy trực tiếp trước khi mua.',
      'Cuối cùng, kiểm tra chính sách bảo hành, đổi trả và các phụ kiện tương thích. Giá niêm yết chỉ là một phần trong tổng chi phí sử dụng thiết bị.',
    ],
  },
  {
    id: 2,
    category: 'Hướng dẫn',
    title: 'Cách giữ pin điện thoại bền hơn trong quá trình sử dụng',
    excerpt: 'Một vài thói quen sạc và sử dụng đơn giản có thể giúp bạn chăm sóc pin tốt hơn.',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85',
    content: [
      'Dùng bộ sạc tương thích và phụ kiện có nguồn gốc rõ ràng. Tránh để thiết bị ở nơi quá nóng trong thời gian dài, đặc biệt khi đang sạc.',
      'Bật các tính năng tối ưu pin nếu thiết bị hỗ trợ và cập nhật phần mềm định kỳ. Không cần cố duy trì một quy tắc sạc duy nhất; hãy làm theo hướng dẫn của nhà sản xuất.',
    ],
  },
  {
    id: 3,
    category: 'Góc phụ kiện',
    title: 'Chọn tai nghe phù hợp: không dây hay có dây?',
    excerpt: 'So sánh nhanh ưu điểm của hai kiểu tai nghe để tìm lựa chọn phù hợp với thói quen nghe.',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
    content: [
      'Tai nghe không dây tiện lợi khi di chuyển và giảm vướng víu. Bạn nên để ý thời lượng pin, cách đeo và khả năng kết nối với thiết bị của mình.',
      'Tai nghe có dây thường không cần sạc riêng và thao tác đơn giản. Hãy kiểm tra chuẩn kết nối, vì một số điện thoại cần đầu chuyển phù hợp.',
    ],
  },
]

const supportFaqs = [
  { question: 'Làm sao để đặt hàng trên MobiHub?', answer: 'Chọn sản phẩm, thêm vào giỏ hàng, cập nhật số lượng rồi điền thông tin giao hàng để tạo đơn demo.' },
  { question: 'Tôi có thể theo dõi đơn hàng ở đâu?', answer: 'Đăng nhập tài khoản và mở mục Lịch sử đặt hàng. Trạng thái đơn hiện tại được lưu trên trình duyệt này.' },
  { question: 'Mã khuyến mãi được áp dụng thế nào?', answer: 'Nhập mã trong giỏ hàng. Mỗi mã có điều kiện giá trị đơn tối thiểu và mức giảm tối đa được hiển thị tại mục Ưu đãi.' },
  { question: 'MobiHub có cửa hàng thật không?', answer: 'Các địa điểm hiện trên trang chỉ là dữ liệu minh họa cho bản demo, chưa phải địa chỉ cửa hàng đang hoạt động.' },
]

const seedOrders: Order[] = [
  { id: '#MH-24091', customer: 'Nguyễn Minh Anh', phone: '0909091111', address: '12 Lê Lợi, Quận 1, TP.HCM', payment: 'COD', item: 'iPhone 15 Pro Max', items: [{ name: 'iPhone 15 Pro Max', price: 28990000 }], amount: 28990000, status: 'Đang giao', time: '10 phút trước' },
  { id: '#MH-24090', customer: 'Trần Quốc Bảo', phone: '0909092222', address: '88 Hai Bà Trưng, Hà Nội', payment: 'Momo', item: 'Galaxy S24 Ultra', items: [{ name: 'Galaxy S24 Ultra', price: 23990000 }], amount: 23990000, status: 'Đang xử lý', time: '42 phút trước' },
  { id: '#MH-24089', customer: 'Lê Hoàng Nam', phone: '0909093333', address: '4 Phạm Ngũ Lão, Đà Nẵng', payment: 'Banking', item: 'Xiaomi 14T Pro', items: [{ name: 'Xiaomi 14T Pro', price: 13990000 }], amount: 13990000, status: 'Hoàn tất', time: '1 giờ trước' },
  { id: '#MH-24088', customer: 'Phạm Ngọc Hà', phone: '0909094444', address: '67 Nguyễn Huệ, Bình Dương', payment: 'Card', item: 'MacBook Air M3', items: [{ name: 'MacBook Air M3', price: 24990000 }], amount: 24990000, status: 'Hoàn tất', time: '2 giờ trước' },
]

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'

const readCustomers = (): Customer[] => {
  try {
    const saved = localStorage.getItem('mobihub-customers')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const readStoredList = <T,>(key: string): T[] => {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed as T[] : []
  } catch {
    return []
  }
}

const getReviewStats = (product: Product, reviews: Review[]) => {
  const productReviews = reviews.filter((review) => review.productId === product.id)
  const rating = productReviews.length
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : product.rating
  return { rating, count: productReviews.length }
}

const getPromoDiscount = (code: string, subtotal: number): number | null => {
  if (code === 'MOBI10') return subtotal >= 2000000 ? Math.min(Math.floor(subtotal * 0.1), 500000) : null
  if (code === 'TECH100') return subtotal >= 5000000 ? 100000 : null
  return null
}

const defaultAdmin: AdminAccount = { name: 'Quản trị viên', email: 'admin@mobihub.vn', password: 'admin123' }

const readAdmins = (): AdminAccount[] => {
  try {
    const saved = localStorage.getItem('mobihub-admins')
    return saved ? JSON.parse(saved) : [defaultAdmin]
  } catch {
    return [defaultAdmin]
  }
}

const normalizeOrder = (order: Partial<Order>): Order => ({
  id: order.id || `#MH-${Date.now().toString().slice(-5)}`,
  customer: order.customer || 'Khách hàng',
  phone: order.phone || 'Chưa cập nhật',
  address: order.address || 'Chưa cập nhật',
  payment: order.payment || 'COD',
  item: order.item || 'Sản phẩm',
  items: order.items?.length ? order.items : [{ name: order.item || 'Sản phẩm', price: order.amount || 0 }],
  amount: order.amount || 0,
  status: order.status || 'Đang xử lý',
  time: order.time || 'Chưa xác định',
  subtotal: order.subtotal,
  discount: order.discount,
  promoCode: order.promoCode,
  fulfillment: order.fulfillment || 'Giao hàng',
  pickupStore: order.pickupStore,
})

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mobihub-products')
      if (!saved) return seedProducts

      const parsed: Product[] = JSON.parse(saved)
      if (!Array.isArray(parsed) || localStorage.getItem(accessoryMigrationKey) === 'true') return parsed

      const migrated = [
        ...parsed,
        ...accessoryProducts.filter((product) => !parsed.some((savedProduct) => savedProduct.id === product.id)),
      ]
      localStorage.setItem('mobihub-products', JSON.stringify(migrated))
      localStorage.setItem(accessoryMigrationKey, 'true')
      return migrated
    } catch {
      return seedProducts
    }
  })
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mobihub-orders')
      const parsed = saved ? JSON.parse(saved) : seedOrders
      return Array.isArray(parsed) ? parsed.map(normalizeOrder) : seedOrders
    } catch {
      return seedOrders
    }
  })
  const [mode, setMode] = useState<'store' | 'admin'>('store')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tất cả')
  const [brand, setBrand] = useState('Tất cả')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [productSort, setProductSort] = useState<ProductSort>('recommended')
  const [cart, setCart] = useState<CartItem[]>([])
  const [reviews, setReviews] = useState<Review[]>(() => readStoredList<Review>('mobihub-reviews'))
  const [comparisonIds, setComparisonIds] = useState<number[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(() => readStoredList<SupportRequest>('mobihub-support-requests'))
  const [promoSuggestion, setPromoSuggestion] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [toast, setToast] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => localStorage.getItem('mobihub-admin-session') === 'true')
  const [customers, setCustomers] = useState<Customer[]>(readCustomers)
  const [admins, setAdmins] = useState<AdminAccount[]>(readAdmins)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('mobihub-current-customer')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const updateOrders = (nextOrders: Order[]) => {
    setOrders(nextOrders)
    localStorage.setItem('mobihub-orders', JSON.stringify(nextOrders))
  }

  const saveCustomers = (nextCustomers: Customer[]) => {
    setCustomers(nextCustomers)
    localStorage.setItem('mobihub-customers', JSON.stringify(nextCustomers))
  }

  const saveAdmins = (nextAdmins: AdminAccount[]) => {
    setAdmins(nextAdmins)
    localStorage.setItem('mobihub-admins', JSON.stringify(nextAdmins))
  }

  const saveReview = (review: Omit<Review, 'id' | 'date'>) => {
    const nextReviews = [{ ...review, id: `${Date.now()}-${review.productId}`, date: new Date().toLocaleDateString('vi-VN') }, ...reviews]
    setReviews(nextReviews)
    localStorage.setItem('mobihub-reviews', JSON.stringify(nextReviews))
    notify('Đã lưu đánh giá trên thiết bị này')
  }

  const toggleComparison = (productId: number) => {
    if (comparisonIds.includes(productId)) {
      setComparisonIds(comparisonIds.filter((id) => id !== productId))
      return
    }
    if (comparisonIds.length >= 3) {
      notify('Bạn chỉ có thể so sánh tối đa 3 sản phẩm')
      return
    }
    setComparisonIds([...comparisonIds, productId])
  }

  const saveSupportRequest = (request: Omit<SupportRequest, 'id' | 'createdAt'>) => {
    const nextRequests = [{ ...request, id: `MH-SUP-${Date.now()}`, createdAt: new Date().toLocaleString('vi-VN') }, ...supportRequests]
    setSupportRequests(nextRequests)
    localStorage.setItem('mobihub-support-requests', JSON.stringify(nextRequests))
    notify('Đã lưu yêu cầu trên thiết bị này')
  }

  const loginCustomer = (customer: Customer) => {
    setCurrentCustomer(customer)
    setMode('store')
    localStorage.setItem('mobihub-current-customer', JSON.stringify(customer))
  }

  const logoutCustomer = () => {
    setCurrentCustomer(null)
    localStorage.removeItem('mobihub-current-customer')
    setShowOrderHistory(false)
    notify('Đã đăng xuất tài khoản khách hàng')
  }

  const openAdmin = () => {
    if (currentCustomer) return
    if (adminAuthenticated) setMode('admin')
    else setShowAdminLogin(true)
  }

  const logoutAdmin = () => {
    setAdminAuthenticated(false)
    setMode('store')
    setShowAdminLogin(false)
    localStorage.removeItem('mobihub-admin-session')
    notify('Đã đăng xuất tài khoản quản trị')
  }

  const categories = ['Tất cả', 'iPhone', 'Samsung', 'Xiaomi', 'OPPO', 'Tablet', 'Laptop', 'Tai nghe', 'Tai nghe có dây', 'Sạc dự phòng']
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, 'vi')), [products])
  const filtered = useMemo(() => {
    const matching = products.filter((item) => {
      const matchesCategory = category === 'Tất cả' || item.category === category
      const matchesBrand = brand === 'Tất cả' || item.brand === brand
      const matchesQuery = `${item.name} ${item.brand} ${item.category}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))
      const matchesMinPrice = minPrice === '' || item.price >= Number(minPrice)
      const matchesMaxPrice = maxPrice === '' || item.price <= Number(maxPrice)
      return matchesCategory && matchesBrand && matchesQuery && matchesMinPrice && matchesMaxPrice
    })

    switch (productSort) {
      case 'price-asc':
        return matching.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return matching.sort((a, b) => b.price - a.price)
      case 'rating':
        return matching.sort((a, b) => getReviewStats(b, reviews).rating - getReviewStats(a, reviews).rating)
      default:
        return matching
    }
  }, [products, category, brand, query, minPrice, maxPrice, productSort, reviews])
  const resetCatalogFilters = () => {
    setCategory('Tất cả')
    setBrand('Tất cả')
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    setProductSort('recommended')
  }
  const canViewAdmin = adminAuthenticated && !currentCustomer

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const addToCart = (product: Product) => {
    const current = cart.find((item) => item.product.id === product.id)
    if (product.stock < 1) {
      notify('Sản phẩm hiện đã hết hàng')
      return
    }
    if (current && current.quantity >= product.stock) {
      notify('Số lượng trong giỏ đã đạt tồn kho')
      return
    }
    setCart((items) => current
      ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { product, quantity: 1 }])
    notify('Đã thêm sản phẩm vào giỏ hàng')
  }

  const saveProducts = (next: Product[]) => {
    setProducts(next)
    localStorage.setItem('mobihub-products', JSON.stringify(next))
  }

  const submitProduct = (product: Product) => {
    const nextProducts = editing
      ? products.map((item) => (item.id === product.id ? product : item))
      : [...products, { ...product, id: Date.now() }]

    saveProducts(nextProducts)
    setShowForm(false)
    setEditing(null)
    notify(editing ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <span>Miễn phí giao hàng đơn từ 500.000đ</span>
          <div className="top-links">
            <button onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })}>Trung tâm hỗ trợ</button>
              <button onClick={() => setShowOrderHistory(true)}>Kiểm tra đơn hàng</button>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-inner">
          {!currentCustomer && (
            <button className="menu-button" aria-label="Mở trang quản trị" onClick={() => mode === 'admin' ? setMode('store') : openAdmin()}>
              <Menu size={20} />
            </button>
          )}

          <button className="brand" onClick={() => setMode('store')}>
            <span className="brand-mark">
              <Smartphone size={19} />
            </span>
            <span>
              Mobi<span>Hub</span>
            </span>
          </button>

          <div className="nav-pills">
            <button className={mode === 'store' ? 'active' : ''} onClick={() => setMode('store')}>
              Cửa hàng
            </button>
            {!currentCustomer && (
              <button className={mode === 'admin' ? 'active' : ''} onClick={openAdmin}>
                <LayoutDashboard size={15} /> Quản trị
              </button>
            )}
          </div>

          {mode === 'store' && (
            <div className="searchbox">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm, thương hiệu..." />
              <kbd>⌘ K</kbd>
            </div>
          )}

          <div className="nav-actions">
            <button className="icon-btn user-btn" onClick={() => setShowOrderHistory(true)}>
              <CircleUserRound size={20} />
              <span>{currentCustomer ? currentCustomer.name : 'Tài khoản'}</span>
            </button>
            <button className="cart-btn" onClick={() => setShowCart(true)}>
              <ShoppingCart size={19} />
              <b>{cart.reduce((sum, item) => sum + item.quantity, 0)}</b>
              <span>Giỏ hàng</span>
            </button>
          </div>
        </div>
      </nav>

      {!canViewAdmin || mode === 'store' ? (
        <StoreView
          categories={categories}
          category={category}
          setCategory={setCategory}
          brands={brands}
          brand={brand}
          setBrand={setBrand}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          productSort={productSort}
          setProductSort={setProductSort}
          resetFilters={resetCatalogFilters}
          filtered={filtered}
          totalProducts={products.length}
          reviews={reviews}
          comparisonIds={comparisonIds}
          onToggleComparison={toggleComparison}
          onOpenComparison={() => setShowComparison(true)}
          onSelectPromotion={(code) => {
            setPromoSuggestion(code)
            if (cart.length > 0) setShowCart(true)
            else notify(`Đã lưu mã ${code}. Thêm sản phẩm vào giỏ để áp dụng.`)
          }}
          onSubmitSupport={saveSupportRequest}
          onOpenArticle={setSelectedArticle}
          addToCart={addToCart}
          setSelected={setSelected}
        />
      ) : (
        <AdminView
          products={products}
          orders={orders}
          customerCount={customers.length}
          setOrders={updateOrders}
          onLogout={logoutAdmin}
          onViewInvoice={setSelectedOrder}
          onAdd={() => {
            setEditing(null)
            setShowForm(true)
          }}
          onEdit={(product) => {
            setEditing(product)
            setShowForm(true)
          }}
          onDelete={(id) => {
            saveProducts(products.filter((product) => product.id !== id))
            setComparisonIds((current) => current.filter((productId) => productId !== id))
            notify('Đã xóa sản phẩm')
          }}
        />
      )}

      {selected && (
        <ProductModal
          product={selected}
          reviews={reviews.filter((review) => review.productId === selected.id)}
          onClose={() => setSelected(null)}
          addToCart={addToCart}
          onReview={(review) => saveReview({ ...review, productId: selected.id })}
        />
      )}
      {showCart && (
        <CartDrawer
          cart={cart}
          initialPromoCode={promoSuggestion}
          onClose={() => setShowCart(false)}
          updateQuantity={(productId, change) => setCart((items) =>
            items.flatMap((item) => {
              if (item.product.id !== productId) return [item]
              const quantity = item.quantity + change
              return quantity > 0 ? [{ ...item, quantity }] : []
            }),
          )}
          remove={(productId) => setCart((items) => items.filter((item) => item.product.id !== productId))}
          checkout={(payload: CheckoutPayload) => {
            const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            const orderItems = cart.map(({ product, quantity }) => ({ name: product.name, price: product.price, quantity }))
            const itemNames = orderItems.map((item) => item.name).slice(0, 2).join(', ')
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

            const newOrder: Order = {
              id: `#MH-${Date.now().toString().slice(-5)}`,
              customer: payload.customer,
              phone: payload.phone,
              address: payload.address,
              fulfillment: payload.fulfillment,
              pickupStore: payload.pickupStore || undefined,
              payment: payload.payment,
              item: itemCount > 2 ? `${itemNames} + ${itemCount - 2} sản phẩm` : itemNames || 'Sản phẩm',
              items: orderItems,
              amount: subtotal - payload.discount,
              status: 'Đang xử lý',
              time: 'Vừa xong',
              subtotal,
              discount: payload.discount,
              promoCode: payload.promoCode || undefined,
            }

            updateOrders([newOrder, ...orders])
            setShowCart(false)
            setCart([])
            setPromoSuggestion('')
            notify(`Đặt hàng thành công cho ${payload.customer}. Thanh toán: ${payload.payment}`)
          }}
        />
      )}
      {showComparison && (
        <ComparisonModal
          products={products.filter((product) => comparisonIds.includes(product.id))}
          onClose={() => setShowComparison(false)}
          onRemove={toggleComparison}
          onSelectProduct={(product) => {
            setShowComparison(false)
            setSelected(product)
          }}
        />
      )}
      {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      {showForm && <ProductForm product={editing} onClose={() => { setShowForm(false); setEditing(null) }} onSubmit={submitProduct} />}
      {showAdminLogin && <AdminLoginModal admins={admins} onClose={() => setShowAdminLogin(false)} onRegister={(admin) => {
        if (admins.some((item) => item.email.toLowerCase() === admin.email.toLowerCase())) return false
        saveAdmins([...admins, admin])
        localStorage.setItem('mobihub-admin-session', 'true')
        setAdminAuthenticated(true)
        setMode('admin')
        setShowAdminLogin(false)
        return true
      }} onSuccess={() => { setAdminAuthenticated(true); setMode('admin'); setShowAdminLogin(false) }} />}
      {showOrderHistory && (
        <AccountModal
          customer={currentCustomer}
          customers={customers}
          orders={orders.filter((order) => !currentCustomer || order.customer === currentCustomer.name)}
          onClose={() => setShowOrderHistory(false)}
          onLogin={(email, password) => {
            const customer = customers.find((item) => item.email === email && item.password === password)
            if (!customer) return false
            loginCustomer(customer)
            return true
          }}
          onRegister={(customer) => {
            if (customers.some((item) => item.email === customer.email)) return false
            saveCustomers([...customers, customer])
            loginCustomer(customer)
            return true
          }}
          onUpdate={(customer) => {
            const nextCustomers = customers.map((item) => item.email === customer.email ? customer : item)
            saveCustomers(nextCustomers)
            loginCustomer(customer)
          }}
          onLogout={logoutCustomer}
          onViewInvoice={(order) => {
            setShowOrderHistory(false)
            setSelectedOrder(order)
          }}
        />
      )}
      {selectedOrder && <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {toast && toast === 'Đã thêm sản phẩm vào giỏ hàng' ? (
        <button className="toast toast-action" onClick={() => { setShowCart(true); setToast('') }}>
          <Check size={17} /> {toast}
        </button>
      ) : toast ? <div className="toast"><Check size={17} /> {toast}</div> : null}
    </div>
  )
}

function StoreView({
  categories,
  category,
  setCategory,
  brands,
  brand,
  setBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  productSort,
  setProductSort,
  resetFilters,
  filtered,
  totalProducts,
  reviews,
  comparisonIds,
  onToggleComparison,
  onOpenComparison,
  onSelectPromotion,
  onSubmitSupport,
  onOpenArticle,
  addToCart,
  setSelected,
}: {
  categories: string[]
  category: string
  setCategory: (value: string) => void
  brands: string[]
  brand: string
  setBrand: (value: string) => void
  minPrice: string
  setMinPrice: (value: string) => void
  maxPrice: string
  setMaxPrice: (value: string) => void
  productSort: ProductSort
  setProductSort: (value: ProductSort) => void
  resetFilters: () => void
  filtered: Product[]
  totalProducts: number
  reviews: Review[]
  comparisonIds: number[]
  onToggleComparison: (productId: number) => void
  onOpenComparison: () => void
  onSelectPromotion: (code: string) => void
  onSubmitSupport: (request: Omit<SupportRequest, 'id' | 'createdAt'>) => void
  onOpenArticle: (article: Article) => void
  addToCart: (product: Product) => void
  setSelected: (product: Product) => void
}) {
  return (
    <main className="store-main">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> Ưu đãi cuối tuần
          </div>
          <h1>
            Công nghệ mới.
            <br />
            <em>Chất riêng của bạn.</em>
          </h1>
          <p>Khám phá những thiết bị đáng sở hữu nhất hôm nay với mức giá thật dễ chịu.</p>
          <button className="primary-btn" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
            Mua sắm ngay <ArrowRight size={18} />
          </button>
          <div className="hero-stats">
            <span>
              <strong>{totalProducts}</strong>
              <small>sản phẩm trong catalog</small>
            </span>
            <span>
              <strong>3 bước</strong>
              <small>Chọn · so sánh · đặt hàng</small>
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="sun-disc" />
          <div className="hero-phone">
            <img src="https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=90" alt="iPhone 15 Pro Max" />
          </div>
          <div className="floating-note">
            <Star size={15} fill="currentColor" /> 4.9 <small>Được yêu thích nhất</small>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div>
          <Truck size={22} />
          <span>
            <b>Giao nhanh toàn quốc</b>
            <small>Nhận hàng trong 2-4 ngày</small>
          </span>
        </div>
        <div>
          <Check size={22} />
          <span>
            <b>Chính hãng 100%</b>
            <small>Đổi trả trong 30 ngày</small>
          </span>
        </div>
        <div>
          <Tag size={22} />
          <span>
            <b>Giá tốt mỗi ngày</b>
            <small>Cam kết giá cạnh tranh</small>
          </span>
        </div>
        <div>
          <Users size={22} />
          <span>
            <b>Tư vấn tận tâm</b>
            <small>Hỗ trợ 08:00 - 22:00</small>
          </span>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Bộ sưu tập nổi bật</span>
            <h2>
              Chọn món đồ <span>hợp gu</span>
            </h2>
          </div>
          <button className="text-btn" onClick={resetFilters}>
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>

        <div className="category-tabs">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="catalog-toolbar">
          <span className="catalog-count">{filtered.length} sản phẩm</span>
          <button
            className="outline-btn compare-open-btn"
            disabled={comparisonIds.length < 2}
            onClick={onOpenComparison}
          >
            <Scale size={15} /> So sánh ({comparisonIds.length}/3)
          </button>
          <label>
            Thương hiệu
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="Tất cả">Tất cả thương hiệu</option>
              {brands.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <fieldset className="price-filter">
            <legend>Khoảng giá</legend>
            <input
              type="number"
              min="0"
              aria-label="Giá thấp nhất"
              placeholder="Từ"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
            <span>—</span>
            <input
              type="number"
              min="0"
              aria-label="Giá cao nhất"
              placeholder="Đến"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </fieldset>
          <label>
            Sắp xếp
            <select value={productSort} onChange={(event) => setProductSort(event.target.value as ProductSort)}>
              <option value="recommended">Gợi ý</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                reviewStats={getReviewStats(product, reviews)}
                isCompared={comparisonIds.includes(product.id)}
                toggleComparison={onToggleComparison}
                addToCart={addToCart}
                setSelected={setSelected}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <Search size={24} />
            <strong>Chưa tìm thấy sản phẩm phù hợp</strong>
            <span>Thử đổi từ khóa hoặc điều chỉnh bộ lọc.</span>
            <button className="outline-btn" onClick={resetFilters}>Xóa bộ lọc</button>
          </div>
        )}
      </section>

      <PromotionSection offers={promoOffers} onSelect={onSelectPromotion} />
      <StoreLocator stores={demoStores} />
      <ArticleSection items={articles} onOpen={onOpenArticle} />
      <SupportSection onSubmit={onSubmitSupport} />
    </main>
  )
}

function ProductCard({
  product,
  reviewStats,
  isCompared,
  toggleComparison,
  addToCart,
  setSelected,
}: {
  product: Product
  reviewStats: { rating: number; count: number }
  isCompared: boolean
  toggleComparison: (productId: number) => void
  addToCart: (product: Product) => void
  setSelected: (product: Product) => void
}) {
  return (
    <article className="product-card">
      <button className="product-image" onClick={() => setSelected(product)}>
        <img src={product.image} alt={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className="quick-view">Xem nhanh</span>
      </button>

      <div className="product-info">
        <small>{product.brand}</small>
        <h3>{product.name}</h3>
        <div className="rating">
          <Star size={14} fill="currentColor" /> {reviewStats.count ? reviewStats.rating.toFixed(1) : '—'}
          <span>({reviewStats.count ? `${reviewStats.count} đánh giá` : 'chưa có đánh giá'})</span>
          <span>·</span> <span>{product.stock} sản phẩm</span>
        </div>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <del>{money(product.oldPrice)}</del>
        </div>

        <div className="card-bottom">
          <div className="swatches">
            {product.colors.map((color) => (
              <i key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
          <button className={`compare-toggle ${isCompared ? 'selected' : ''}`} onClick={() => toggleComparison(product.id)}>
            <Scale size={14} /> {isCompared ? 'Đã chọn' : 'So sánh'}
          </button>
          <button className="add-btn" onClick={() => addToCart(product)}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}

function ProductModal({
  product,
  reviews,
  onClose,
  addToCart,
  onReview,
}: {
  product: Product
  reviews: Review[]
  onClose: () => void
  addToCart: (product: Product) => void
  onReview: (review: { name: string; rating: number; comment: string }) => void
}) {
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState('5')
  const [reviewComment, setReviewComment] = useState('')
  const reviewStats = getReviewStats(product, reviews)

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal product-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="modal-content">
          <small>{product.brand}</small>
          <h2>{product.name}</h2>
          <div className="rating">
            <Star size={15} fill="currentColor" /> {reviews.length ? reviewStats.rating.toFixed(1) : 'Chưa có đánh giá'}
          </div>
          <div className="modal-price">
            {money(product.price)} <del>{money(product.oldPrice)}</del>
          </div>
          <div className="product-details">
            <div><span>Thương hiệu</span><b>{product.brand}</b></div>
            <div><span>Danh mục</span><b>{product.category}</b></div>
            <div><span>Tình trạng</span><b>{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Tạm hết hàng'}</b></div>
            <div><span>Màu sắc</span><b>{product.colors.length} lựa chọn</b></div>
          </div>
          <div className="specification-list">
            <h3>Thông số kỹ thuật</h3>
            {product.specifications?.trim() ? product.specifications.split('\n').filter(Boolean).map((line) => {
              const [label, ...values] = line.split(':')
              return <div key={line}><span>{label.trim()}</span><b>{values.join(':').trim() || '—'}</b></div>
            }) : <p>Chưa cập nhật thông số cho sản phẩm này. Quản trị viên có thể bổ sung trong mục chỉnh sửa sản phẩm.</p>}
          </div>
          <p>Thông tin hiển thị dựa trên catalog demo hiện tại. Vui lòng kiểm tra chính sách và thông số từ nhà sản xuất trước khi mua thực tế.</p>
          <div className="modal-actions">
            <button className="primary-btn" disabled={product.stock < 1} onClick={() => { addToCart(product); onClose() }}>
              Thêm vào giỏ <ShoppingCart size={17} />
            </button>
            <button className="outline-btn" onClick={onClose}>Đóng</button>
          </div>
          <section className="review-panel">
            <div className="review-heading">
              <div><span className="section-kicker">Cộng đồng</span><h3>Đánh giá sản phẩm</h3></div>
              <strong><Star size={15} fill="currentColor" /> {reviewStats.rating.toFixed(1)}</strong>
            </div>
            <form className="review-form" onSubmit={(event) => {
              event.preventDefault()
              onReview({ name: reviewName.trim() || 'Khách MobiHub', rating: Number(reviewRating), comment: reviewComment.trim() })
              setReviewName('')
              setReviewRating('5')
              setReviewComment('')
            }}>
              <input value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Tên hiển thị (không bắt buộc)" maxLength={60} />
              <select aria-label="Số sao" value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>
                <option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option>
              </select>
              <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Chia sẻ cảm nhận của bạn" required maxLength={500} />
              <button className="outline-btn" type="submit"><MessageCircle size={15} /> Gửi đánh giá</button>
              <small>Đánh giá demo được lưu trên trình duyệt này, chưa gửi lên máy chủ.</small>
            </form>
            <div className="review-list">
              {reviews.length ? reviews.slice(0, 5).map((review) => (
                <article key={review.id}>
                  <div><b>{review.name}</b><small>{review.date}</small></div>
                  <span><Star size={13} fill="currentColor" /> {review.rating}/5</span>
                  <p>{review.comment}</p>
                </article>
              )) : <p className="muted-copy">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({
  cart,
  initialPromoCode,
  onClose,
  updateQuantity,
  remove,
  checkout,
}: {
  cart: CartItem[]
  initialPromoCode: string
  onClose: () => void
  updateQuantity: (productId: number, change: number) => void
  remove: (productId: number) => void
  checkout: (payload: CheckoutPayload) => void
}) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const [promoCode, setPromoCode] = useState(initialPromoCode)
  const [appliedPromo, setAppliedPromo] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const discount = appliedPromo ? getPromoDiscount(appliedPromo, subtotal) || 0 : 0
  const total = subtotal - discount
  const [isCheckoutForm, setIsCheckoutForm] = useState(false)
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [fulfillment, setFulfillment] = useState<CheckoutPayload['fulfillment']>('Giao hàng')
  const [pickupStore, setPickupStore] = useState('')
  const [payment, setPayment] = useState<CheckoutPayload['payment']>('COD')
  const [errors, setErrors] = useState<{ customer?: string; phone?: string; address?: string; pickupStore?: string }>({})

  const submitOrder = () => {
    const selectedStore = demoStores.find((store) => store.id === Number(pickupStore))
    const nextErrors = {
      customer: customer.trim() ? undefined : 'Vui lòng nhập họ và tên',
      phone: phone.trim() ? undefined : 'Vui lòng nhập số điện thoại',
      address: fulfillment === 'Giao hàng' && !address.trim() ? 'Vui lòng nhập địa chỉ giao hàng' : undefined,
      pickupStore: fulfillment === 'Nhận tại cửa hàng' && !selectedStore ? 'Vui lòng chọn điểm nhận hàng' : undefined,
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    checkout({
      customer: customer.trim(),
      phone: phone.trim(),
      address: fulfillment === 'Giao hàng' ? address.trim() : selectedStore?.address || '',
      payment,
      promoCode: appliedPromo,
      discount,
      fulfillment,
      pickupStore: selectedStore?.name || '',
    })
  }

  return (
    <div className="overlay drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="section-kicker">Đơn hàng của bạn</span>
            <h2>
              Giỏ hàng <span>({itemCount})</span>
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={40} />
            <p>Giỏ hàng đang trống</p>
            <button className="outline-btn" onClick={onClose}>Tiếp tục mua sắm</button>
          </div>
        ) : isCheckoutForm ? (
          <div className="checkout-form-wrap">
            <div className="checkout-total">
              <div><span>Tạm tính</span><b>{money(subtotal)}</b></div>
              {discount > 0 && <div><span>Ưu đãi {appliedPromo}</span><b className="promo-success">−{money(discount)}</b></div>}
              <div><strong>Tổng thanh toán</strong><strong>{money(total)}</strong></div>
            </div>
            <div className="checkout-form-block">
              <label>
                Họ và tên
                <input className={errors.customer ? 'input-error' : ''} value={customer} onChange={(event) => { setCustomer(event.target.value); setErrors((current) => ({ ...current, customer: undefined })) }} placeholder="Nguyễn Văn A" />
                {errors.customer && <span className="field-error">{errors.customer}</span>}
              </label>
              <label>
                Số điện thoại
                <input className={errors.phone ? 'input-error' : ''} value={phone} onChange={(event) => { setPhone(event.target.value); setErrors((current) => ({ ...current, phone: undefined })) }} placeholder="0909 123 456" />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>
              <label>
                Hình thức nhận hàng
                <select value={fulfillment} onChange={(event) => {
                  setFulfillment(event.target.value as CheckoutPayload['fulfillment'])
                  setErrors((current) => ({ ...current, address: undefined, pickupStore: undefined }))
                }}>
                  <option value="Giao hàng">Giao hàng đến địa chỉ</option>
                  <option value="Nhận tại cửa hàng">Nhận tại cửa hàng</option>
                </select>
              </label>
              {fulfillment === 'Giao hàng' ? (
                <label>
                  Địa chỉ giao hàng
                  <input className={errors.address ? 'input-error' : ''} value={address} onChange={(event) => { setAddress(event.target.value); setErrors((current) => ({ ...current, address: undefined })) }} placeholder="123 Lê Lợi, Q.1, TP.HCM" />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </label>
              ) : (
                <label>
                  Điểm nhận hàng
                  <select className={errors.pickupStore ? 'input-error' : ''} value={pickupStore} onChange={(event) => { setPickupStore(event.target.value); setErrors((current) => ({ ...current, pickupStore: undefined })) }}>
                    <option value="">Chọn cửa hàng minh họa</option>
                    {demoStores.map((store) => <option key={store.id} value={store.id}>{store.name} — {store.city}</option>)}
                  </select>
                  {errors.pickupStore && <span className="field-error">{errors.pickupStore}</span>}
                </label>
              )}
              <label>
                Phương thức thanh toán
                <select value={payment} onChange={(event) => setPayment(event.target.value as CheckoutPayload['payment'])}>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="Momo">Ví Momo</option>
                  <option value="Banking">Chuyển khoản ngân hàng</option>
                  <option value="Card">Thẻ tín dụng / ghi nợ</option>
                </select>
              </label>
              <p className="demo-note">Đây là quy trình đặt hàng demo. Thanh toán, giao hàng và điểm nhận chưa kết nối hệ thống thực tế.</p>
            </div>

            <div className="checkout-action-row">
              <button className="outline-btn" onClick={() => setIsCheckoutForm(false)}>Quay lại</button>
              <button className="primary-btn" onClick={submitOrder}>
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="promo-entry">
              <label htmlFor="promo-code">Mã khuyến mãi</label>
              <div>
                <input id="promo-code" value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} placeholder="Nhập mã ưu đãi" />
                <button className="outline-btn" onClick={() => {
                  const code = promoCode.trim().toUpperCase()
                  const amount = getPromoDiscount(code, subtotal)
                  if (amount === null) {
                    setAppliedPromo('')
                    setPromoMessage(code === 'MOBI10' || code === 'TECH100' ? 'Đơn hàng chưa đạt giá trị tối thiểu của mã.' : 'Mã ưu đãi không hợp lệ.')
                    return
                  }
                  setAppliedPromo(code)
                  setPromoMessage(`Đã áp dụng ${code}.`)
                }}>Áp dụng</button>
              </div>
              {promoMessage && <small className={discount ? 'promo-success' : 'promo-error'}>{promoMessage}</small>}
            </div>
            <div className="cart-items">
              {cart.map(({ product, quantity }) => (
                <div className="cart-item" key={product.id}>
                  <img src={product.image} alt="" />
                  <div>
                    <b>{product.name}</b>
                    <span>{money(product.price * quantity)}</span>
                    <small>{money(product.price)} / sản phẩm</small>
                  </div>
                  <div className="quantity-control" aria-label={`Số lượng ${product.name}`}>
                    <button aria-label={`Giảm số lượng ${product.name}`} onClick={() => updateQuantity(product.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label={`Tăng số lượng ${product.name}`}
                      disabled={quantity >= product.stock}
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="remove-cart-item" aria-label={`Xóa ${product.name} khỏi giỏ`} onClick={() => remove(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Tạm tính</span>
                <b>{money(subtotal)}</b>
              </div>
              {discount > 0 && <div><span>Ưu đãi {appliedPromo}</span><b className="promo-success">−{money(discount)}</b></div>}
              {appliedPromo && discount === 0 && <div><span>Mã {appliedPromo}</span><b className="promo-error">Không còn đủ điều kiện</b></div>}
              <div>
                <span>Phí giao hàng</span>
                <b className="free">Miễn phí</b>
              </div>
              <hr />
              <div className="total">
                <span>Tổng cộng</span>
                <b>{money(total)}</b>
              </div>
              <button className="primary-btn full" onClick={() => setIsCheckoutForm(true)}>
                Tiến hành đặt hàng <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function PromotionSection({ offers, onSelect }: {
  offers: typeof promoOffers
  onSelect: (code: string) => void
}) {
  return (
    <section className="content-section promotion-section" id="promotions">
      <div className="section-heading">
        <div><span className="section-kicker">Ưu đãi MobiHub</span><h2>Mã giảm giá <span>demo</span></h2></div>
        <Tag size={25} />
      </div>
      <div className="promotion-grid">
        {offers.map((offer) => (
          <article className="promotion-card" key={offer.code}>
            <div className="promotion-ticket"><b>{offer.title}</b><span>{offer.description}</span></div>
            <div className="promotion-action"><code>{offer.code}</code><button className="outline-btn" onClick={() => onSelect(offer.code)}>Dùng mã</button></div>
          </article>
        ))}
      </div>
      <p className="demo-note">Ưu đãi minh họa cho bản demo. Mã được áp dụng tại giỏ hàng và chưa kết nối hệ thống thanh toán.</p>
    </section>
  )
}

function StoreLocator({ stores }: { stores: StoreLocation[] }) {
  const [city, setCity] = useState('Tất cả')
  const cities = ['Tất cả', ...new Set(stores.map((store) => store.city))]
  const visibleStores = city === 'Tất cả' ? stores : stores.filter((store) => store.city === city)

  return (
    <section className="content-section locator-section" id="stores">
      <div className="section-heading">
        <div><span className="section-kicker">Tìm điểm gần bạn</span><h2>Hệ thống cửa hàng <span>demo</span></h2></div>
        <MapPin size={25} />
      </div>
      <p className="demo-note">Các địa chỉ dưới đây chỉ minh họa giao diện, không phải cửa hàng đang hoạt động. Tồn kho theo chi nhánh chưa được kết nối.</p>
      <div className="locator-filter">
        <label htmlFor="store-city">Khu vực</label>
        <select id="store-city" value={city} onChange={(event) => setCity(event.target.value)}>
          {cities.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="store-grid">
        {visibleStores.map((store) => (
          <article className="store-card" key={store.id}>
            <div className="store-card-icon"><MapPin size={20} /></div>
            <span className="store-city">{store.city}</span>
            <h3>{store.name}</h3>
            <p>{store.address}</p>
            <div><Clock3 size={15} /> {store.hours} · giờ minh họa</div>
            <div><Phone size={15} /> {store.phone}</div>
            <a className="outline-btn" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noreferrer">Xem trên bản đồ</a>
          </article>
        ))}
      </div>
    </section>
  )
}

function ArticleSection({ items, onOpen }: { items: Article[]; onOpen: (article: Article) => void }) {
  return (
    <section className="content-section article-section" id="articles">
      <div className="section-heading">
        <div><span className="section-kicker">MobiHub chia sẻ</span><h2>Góc công nghệ <span>& mẹo hay</span></h2></div>
        <BookOpen size={25} />
      </div>
      <div className="article-grid">
        {items.map((article) => (
          <article className="article-card" key={article.id}>
            <button className="article-image" onClick={() => onOpen(article)} aria-label={`Đọc bài: ${article.title}`}>
              <img src={article.image} alt="" loading="lazy" />
            </button>
            <div className="article-copy">
              <div><span>{article.category}</span><small>{article.readTime}</small></div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button className="text-btn" onClick={() => onOpen(article)}>Đọc bài viết <ArrowRight size={15} /></button>
            </div>
          </article>
        ))}
      </div>
      <p className="demo-note">Nội dung biên tập dùng cho bản demo, chỉ mang tính tham khảo.</p>
    </section>
  )
}

function SupportSection({ onSubmit }: {
  onSubmit: (request: Omit<SupportRequest, 'id' | 'createdAt'>) => void
}) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="content-section support-section" id="support">
      <div className="section-heading">
        <div><span className="section-kicker">MobiHub đồng hành</span><h2>Trung tâm <span>hỗ trợ</span></h2></div>
        <MessageCircle size={25} />
      </div>
      <div className="support-layout">
        <div className="faq-list">
          {supportFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}<ChevronDown size={17} /></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
          <div className="support-contact-note"><Mail size={18} /><span><b>Gửi câu hỏi cho MobiHub</b><small>Biểu mẫu demo chỉ lưu nội dung trong trình duyệt này; chưa gửi thông tin đến nhân viên hỗ trợ.</small></span></div>
        </div>
        <form className="support-form" onSubmit={(event) => {
          event.preventDefault()
          onSubmit({ name: name.trim(), contact: contact.trim(), message: message.trim() })
          setName('')
          setContact('')
          setMessage('')
          setSubmitted(true)
        }}>
          <h3>Để lại lời nhắn</h3>
          <label>Họ tên<input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên của bạn" /></label>
          <label>Email hoặc số điện thoại<input required maxLength={120} value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Thông tin liên hệ" /></label>
          <label>Nội dung<textarea required maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Bạn cần MobiHub hỗ trợ điều gì?" /></label>
          {submitted && <p className="support-success">Đã lưu lời nhắn trên thiết bị này.</p>}
          <button className="primary-btn" type="submit"><MessageCircle size={16} /> Gửi lời nhắn</button>
        </form>
      </div>
    </section>
  )
}

function ComparisonModal({ products, onClose, onRemove, onSelectProduct }: {
  products: Product[]
  onClose: () => void
  onRemove: (productId: number) => void
  onSelectProduct: (product: Product) => void
}) {
  const rows: Array<{ label: string; value: (product: Product) => ReactNode }> = [
    { label: 'Thương hiệu', value: (product) => product.brand },
    { label: 'Danh mục', value: (product) => product.category },
    { label: 'Giá bán', value: (product) => <b>{money(product.price)}</b> },
    { label: 'Giá niêm yết', value: (product) => money(product.oldPrice) },
    { label: 'Đánh giá mẫu', value: (product) => <><Star size={14} fill="currentColor" /> {product.rating.toFixed(1)}/5</> },
    { label: 'Tồn kho', value: (product) => `${product.stock} sản phẩm` },
    { label: 'Màu sắc', value: (product) => `${product.colors.length} lựa chọn` },
    { label: 'Thông số kỹ thuật', value: (product) => product.specifications?.trim() || 'Chưa cập nhật' },
  ]

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal comparison-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title"><div><span className="section-kicker">Đối chiếu catalog</span><h2>So sánh sản phẩm</h2></div><button className="close-btn" onClick={onClose}><X size={20} /></button></div>
        {products.length < 2 ? <div className="catalog-empty"><Scale size={24} /><strong>Chọn ít nhất 2 sản phẩm để so sánh</strong></div> : (
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead><tr><th>Thông tin</th>{products.map((product) => <th key={product.id}><img src={product.image} alt="" /><b>{product.name}</b><button className="tiny-link" onClick={() => onRemove(product.id)}>Bỏ chọn</button></th>)}</tr></thead>
              <tbody>{rows.map((row) => <tr key={row.label}><th>{row.label}</th>{products.map((product) => <td key={product.id}>{row.value(product)}</td>)}</tr>)}</tbody>
              <tfoot><tr><th></th>{products.map((product) => <td key={product.id}><button className="primary-btn" onClick={() => onSelectProduct(product)}>Xem chi tiết</button></td>)}</tr></tfoot>
            </table>
          </div>
        )}
        <p className="demo-note">Đánh giá và thông tin chỉ phản ánh dữ liệu catalog trên thiết bị; đây chưa phải thông số xác thực từ nhà sản xuất.</p>
      </div>
    </div>
  )
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <article className="modal article-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        <img src={article.image} alt="" />
        <div className="article-modal-copy">
          <span className="section-kicker">{article.category} · {article.readTime}</span>
          <h2>{article.title}</h2>
          <p className="article-lead">{article.excerpt}</p>
          {article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="demo-note">Nội dung tham khảo trong bản demo MobiHub.</p>
        </div>
      </article>
    </div>
  )
}

function AdminView({
  products,
  orders,
  customerCount,
  setOrders,
  onLogout,
  onViewInvoice,
  onAdd,
  onEdit,
  onDelete,
}: {
  products: Product[]
  orders: Order[]
  customerCount: number
  setOrders: (orders: Order[]) => void
  onLogout: () => void
  onViewInvoice: (order: Order) => void
  onAdd: () => void
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}) {
  const revenue = orders.filter((order) => order.status === 'Hoàn tất').reduce((sum, order) => sum + order.amount, 0)

  return (
    <main className="admin-main">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">Trung tâm vận hành</span>
          <h1>
            Tổng quan <span>cửa hàng</span>
          </h1>
          <p>Cập nhật lúc 09:42 hôm nay</p>
        </div>
        <div className="admin-heading-actions">
          <button className="outline-btn" onClick={onLogout}>Đăng xuất Admin</button>
          <button className="primary-btn" onClick={onAdd}><Plus size={18} /> Thêm sản phẩm</button>
        </div>
      </div>

      <div className="metric-grid">
        <Metric icon={<BarChart3 />} label="Doanh thu tháng" value={money(revenue)} trend="+18,4%" />
        <Metric icon={<ShoppingBag />} label="Đơn hàng" value="1.284" trend="+12,8%" />
        <Metric icon={<Package />} label="Sản phẩm" value={`${products.length}`} trend="Đang bán" />
        <Metric icon={<Users />} label="Khách hàng" value={`${customerCount}`} trend="Tài khoản đã đăng ký" />
      </div>

      <div className="admin-columns">
        <section className="admin-panel">
          <div className="panel-head">
            <div>
              <h2>Đơn hàng gần đây</h2>
              <p>Theo dõi tiến độ xử lý đơn</p>
            </div>
            <button className="filter-btn">
              7 ngày <ChevronDown size={15} />
            </button>
          </div>

          <div className="orders-table">
            <div className="table-row table-label">
              <span>Mã đơn</span>
              <span>Khách hàng</span>
              <span>Sản phẩm</span>
              <span>Giá trị</span>
              <span>Trạng thái</span>
            </div>

            {orders.map((order) => (
              <div className="table-row" key={order.id}>
                <span>
                  <b>{order.id}</b>
                  <small>{order.time}</small>
                </span>
                <span>{order.customer}</span>
                <span>{order.item}</span>
                <span>
                  <b>{money(order.amount)}</b>
                </span>
                <span className="status-cell">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      setOrders(
                        orders.map((item) =>
                          item.id === order.id ? { ...item, status: event.target.value as Order['status'] } : item,
                        ),
                      )
                    }
                  >
                    <option>Đang xử lý</option>
                    <option>Đang giao</option>
                    <option>Hoàn tất</option>
                  </select>
                  <button className="tiny-link" onClick={() => onViewInvoice(order)}>Hóa đơn</button>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel product-panel">
          <div className="panel-head">
            <div>
              <h2>Danh mục sản phẩm</h2>
              <p>Quản lý hàng hóa và khuyến mãi</p>
            </div>
            <button className="filter-btn">Mới nhất</button>
          </div>

          <div className="product-list">
            {products.map((product) => (
              <div className="product-row" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div className="product-meta">
                  <b>{product.name}</b>
                  <small>{product.category}</small>
                </div>
                <strong>{money(product.price)}</strong>
                <div className="product-actions">
                  <button className="mini-btn" onClick={() => onEdit(product)}>
                    <Settings size={14} />
                  </button>
                  <button className="mini-btn danger" onClick={() => onDelete(product.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function InvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const downloadInvoice = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1400
    canvas.height = 1120 + Math.max(0, order.items.length - 1) * 62
    const context = canvas.getContext('2d')
    if (!context) return

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#102a43'
    context.font = '700 24px Arial'
    context.fillText('MobiHub', 80, 78)
    context.font = '700 42px Arial'
    context.fillText('Hóa đơn đặt hàng', 80, 140)

    const drawField = (label: string, value: string, x: number, y: number) => {
      context.fillStyle = '#718596'
      context.font = '18px Arial'
      context.fillText(label, x, y)
      context.fillStyle = '#102a43'
      context.font = '700 22px Arial'
      context.fillText(value, x, y + 32)
    }

    context.strokeStyle = '#dfe8ec'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(80, 185)
    context.lineTo(1320, 185)
    context.stroke()
    drawField('Mã đơn', order.id, 80, 225)
    drawField('Thời gian', order.time, 760, 225)
    drawField('Khách hàng', order.customer, 80, 330)
    drawField('Số điện thoại', order.phone, 760, 330)
    drawField(order.fulfillment === 'Nhận tại cửa hàng' ? 'Điểm nhận' : 'Địa chỉ giao hàng', order.pickupStore || order.address, 80, 435)
    drawField('Thanh toán', order.payment, 760, 435)
    drawField('Hình thức nhận', order.fulfillment || 'Giao hàng', 80, 540)
    drawField('Trạng thái', order.status, 760, 540)

    const tableTop = 645
    context.fillStyle = '#f3f7f9'
    context.fillRect(80, tableTop, 1240, 58)
    context.fillStyle = '#58707c'
    context.font = '700 17px Arial'
    context.fillText('SẢN PHẨM', 105, tableTop + 36)
    context.fillText('SL', 820, tableTop + 36)
    context.fillText('ĐƠN GIÁ', 930, tableTop + 36)
    context.fillText('THÀNH TIỀN', 1120, tableTop + 36)

    order.items.forEach((item, index) => {
      const rowTop = tableTop + 58 + index * 62
      context.fillStyle = '#102a43'
      context.font = '20px Arial'
      context.fillText(item.name, 105, rowTop + 38)
      context.fillText(String(item.quantity || 1), 820, rowTop + 38)
      context.fillText(money(item.price), 930, rowTop + 38)
      context.fillText(money(item.price * (item.quantity || 1)), 1120, rowTop + 38)
      context.strokeStyle = '#dfe8ec'
      context.beginPath()
      context.moveTo(80, rowTop + 62)
      context.lineTo(1320, rowTop + 62)
      context.stroke()
    })

    const totalY = tableTop + 110 + order.items.length * 62
    context.fillStyle = '#718596'
    context.font = '18px Arial'
    if (order.discount) {
      context.fillText('Tạm tính', 1050, totalY - 38)
      context.fillStyle = '#102a43'
      context.fillText(money(order.subtotal || order.amount + order.discount), 1050, totalY - 8)
      context.fillStyle = '#23845f'
      context.fillText(`Ưu đãi ${order.promoCode || ''}: -${money(order.discount)}`, 930, totalY + 28)
    }
    context.fillStyle = '#718596'
    context.fillText('Tổng thanh toán', 1050, totalY + (order.discount ? 62 : 0))
    context.fillStyle = '#102a43'
    context.font = '700 28px Arial'
    context.fillText(money(order.amount), 1050, totalY + (order.discount ? 98 : 40))

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `hoa-don-${order.id.replace(/[^a-zA-Z0-9-]/g, '')}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal invoice-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title">
          <div>
            <span className="section-kicker">MobiHub</span>
            <h2>Hóa đơn đặt hàng</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="invoice-header">
          <div>
            <small>Mã đơn</small>
            <strong>{order.id}</strong>
          </div>
          <div>
            <small>Thời gian</small>
            <strong>{order.time}</strong>
          </div>
        </div>

        <div className="invoice-grid">
          <div>
            <small>Khách hàng</small>
            <strong>{order.customer}</strong>
          </div>
          <div>
            <small>Số điện thoại</small>
            <strong>{order.phone}</strong>
          </div>
          <div className="wide">
            <small>{order.fulfillment === 'Nhận tại cửa hàng' ? 'Điểm nhận hàng' : 'Địa chỉ giao hàng'}</small>
            <strong>{order.address}</strong>
          </div>
          <div>
            <small>Thanh toán</small>
            <strong>{order.payment}</strong>
          </div>
          <div>
            <small>Trạng thái</small>
            <strong>{order.status}</strong>
          </div>
          <div>
            <small>Hình thức nhận</small>
            <strong>{order.fulfillment || 'Giao hàng'}</strong>
          </div>
          {order.pickupStore && <div className="wide"><small>Cửa hàng nhận</small><strong>{order.pickupStore}</strong></div>}
        </div>

        <div className="invoice-body">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity || 1}</td>
                  <td>{money(item.price)}</td>
                  <td>{money(item.price * (item.quantity || 1))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-foot">
          {order.subtotal !== undefined && order.discount ? (
            <div className="invoice-discount">
              <span>Tạm tính</span><strong>{money(order.subtotal)}</strong>
              <span>Ưu đãi {order.promoCode}</span><strong>−{money(order.discount)}</strong>
            </div>
          ) : null}
          <div>
            <span>Tổng thanh toán</span>
            <strong>{money(order.amount)}</strong>
          </div>
        </div>

        <div className="form-actions">
          <button className="outline-btn" onClick={downloadInvoice}>
            <Download size={16} /> Tải ảnh hóa đơn
          </button>
          <button className="outline-btn" onClick={() => window.print()}>
            In hóa đơn
          </button>
          <button className="primary-btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  )
}

function AdminLoginModal({ admins, onClose, onRegister, onSuccess }: {
  admins: AdminAccount[]
  onClose: () => void
  onRegister: (admin: AdminAccount) => boolean
  onSuccess: () => void
}) {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submit = () => {
    setMessage('')
    const normalizedEmail = email.trim().toLowerCase()

    if (view === 'register') {
      if (!name.trim() || !normalizedEmail || password.length < 6) {
        setMessage('Vui lòng nhập đủ thông tin, mật khẩu tối thiểu 6 ký tự')
        return
      }
      if (!onRegister({ name: name.trim(), email: normalizedEmail, password })) {
        setMessage('Email Admin này đã được đăng ký')
      }
      return
    }

    if (!admins.some((admin) => admin.email.toLowerCase() === normalizedEmail && admin.password === password)) {
      setMessage('Email hoặc mật khẩu Admin chưa chính xác')
      return
    }

    localStorage.setItem('mobihub-admin-session', 'true')
    onSuccess()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal account-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title">
          <div><span className="section-kicker">MobiHub Admin</span><h2>{view === 'login' ? 'Đăng nhập quản trị' : 'Đăng ký tài khoản Admin'}</h2></div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="account-form">
          {view === 'register' && <label>Họ và tên Admin<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nguyễn Văn A" /></label>}
          <label>Email Admin<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@mobihub.vn" /></label>
          <label>{view === 'register' ? 'Mật khẩu mới' : 'Mật khẩu'}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu Admin" /></label>
          {message && <p className="account-message">{message}</p>}
          <button className="primary-btn full" onClick={submit}>{view === 'login' ? 'Vào trang Admin' : 'Tạo tài khoản Admin'}</button>
          <div className="account-links">
            <button onClick={() => { setView(view === 'login' ? 'register' : 'login'); setMessage('') }}>
              {view === 'login' ? 'Đăng ký tài khoản Admin' : 'Quay lại đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountModal({ customer, customers, orders, onClose, onLogin, onRegister, onUpdate, onLogout, onViewInvoice }: {
  customer: Customer | null
  customers: Customer[]
  orders: Order[]
  onClose: () => void
  onLogin: (email: string, password: string) => boolean
  onRegister: (customer: Customer) => boolean
  onUpdate: (customer: Customer) => void
  onLogout: () => void
  onViewInvoice: (order: Order) => void
}) {
  const [view, setView] = useState<'login' | 'register' | 'reset' | 'profile'>(customer ? 'profile' : 'login')
  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const [email, setEmail] = useState(customer?.email || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submit = () => {
    setMessage('')
    if (view === 'login') {
      if (!onLogin(email.trim(), password)) setMessage('Email hoặc mật khẩu chưa chính xác')
      else onClose()
    } else if (view === 'register') {
      if (!name.trim() || !phone.trim() || !email.trim() || password.length < 6) setMessage('Vui lòng nhập đủ thông tin, mật khẩu tối thiểu 6 ký tự')
      else if (!onRegister({ name: name.trim(), phone: phone.trim(), email: email.trim(), password })) setMessage('Email này đã được đăng ký')
      else onClose()
    } else if (view === 'reset') {
      const found = customers.find((item) => item.email === email.trim())
      if (!found) setMessage('Không tìm thấy tài khoản với email này')
      else if (password.length < 6) setMessage('Mật khẩu mới tối thiểu 6 ký tự')
      else { onUpdate({ ...found, password }); setMessage('Đã cấp lại mật khẩu thành công') }
    } else if (customer) {
      onUpdate({ ...customer, name: name.trim(), phone: phone.trim() })
      setMessage('Đã cập nhật thông tin tài khoản')
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal account-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title">
          <div><span className="section-kicker">MobiHub Account</span><h2>{view === 'profile' ? 'Tài khoản của bạn' : view === 'register' ? 'Tạo tài khoản' : view === 'reset' ? 'Cấp lại mật khẩu' : 'Đăng nhập'}</h2></div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        {view === 'profile' ? (
          <>
            <div className="account-profile">
              <label>Họ và tên<input value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label>Số điện thoại<input value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
              <label>Email<input value={email} disabled /></label>
              {message && <p className="account-message">{message}</p>}
              <div className="account-actions"><button className="outline-btn" onClick={() => setView('reset')}>Cấp lại mật khẩu</button><button className="primary-btn" onClick={submit}>Lưu thông tin</button></div>
              <button className="logout-btn" onClick={() => { onLogout(); onClose() }}>Đăng xuất</button>
            </div>
            <div className="history-heading"><ReceiptText size={17} /><strong>Lịch sử đặt hàng</strong></div>
            {orders.length === 0 ? <div className="history-empty"><p>Bạn chưa có đơn hàng nào</p></div> : <div className="history-list">{orders.map((order) => <div className="history-item" key={order.id}><div><strong>{order.id}</strong><span>{order.item}</span><small>{order.time} · {order.status}</small></div><div className="history-side"><b>{money(order.amount)}</b><button className="tiny-link" onClick={() => onViewInvoice(order)}>Xem hóa đơn</button></div></div>)}</div>}
          </>
        ) : (
          <div className="account-form">
            {view === 'register' && <><label>Họ và tên<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Số điện thoại<input value={phone} onChange={(event) => setPhone(event.target.value)} /></label></>}
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>{view === 'reset' ? 'Mật khẩu mới' : 'Mật khẩu'}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {message && <p className="account-message">{message}</p>}
            <button className="primary-btn full" onClick={submit}>{view === 'register' ? 'Đăng ký' : view === 'reset' ? 'Cấp lại mật khẩu' : 'Đăng nhập'}</button>
            <div className="account-links">{view === 'login' && <><button onClick={() => setView('register')}>Đăng ký tài khoản</button><button onClick={() => setView('reset')}>Quên mật khẩu?</button></>}{(view === 'register' || view === 'reset') && <button onClick={() => setView('login')}>Quay lại đăng nhập</button>}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function Metric({ icon, label, value, trend }: { icon: ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="metric">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small className={trend.startsWith('+') ? 'positive' : ''}>{trend}</small>
    </div>
  )
}

function ProductForm({
  product,
  onClose,
  onSubmit,
}: {
  product: Product | null
  onClose: () => void
  onSubmit: (product: Product) => void
}) {
  const [form, setForm] = useState<Product>(
    product || {
      id: 0,
      name: '',
      brand: 'Apple',
      price: 0,
      oldPrice: 0,
      category: 'iPhone',
      rating: 5,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=85',
      colors: ['#adb5bd'],
      specifications: '',
    },
  )

  const update = (key: keyof Product, value: string) => {
    setForm({
      ...form,
      [key]: ['price', 'oldPrice', 'stock'].includes(key) ? Number(value) : value,
    })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal form-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title">
          <div>
            <span className="section-kicker">Kho sản phẩm</span>
            <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="form-grid">
          <label>
            Tên sản phẩm
            <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ví dụ: iPhone 16 Pro" />
          </label>

          <label>
            Thương hiệu
            <select value={form.brand} onChange={(event) => update('brand', event.target.value)}>
              <option>Apple</option>
              <option>Samsung</option>
              <option>Xiaomi</option>
              <option>OPPO</option>
              <option>Sony</option>
              <option>JBL</option>
              <option>Anker</option>
              <option>Baseus</option>
            </select>
          </label>

          <label>
            Giá bán
            <input type="number" value={form.price} onChange={(event) => update('price', event.target.value)} />
          </label>

          <label>
            Giá niêm yết
            <input type="number" value={form.oldPrice} onChange={(event) => update('oldPrice', event.target.value)} />
          </label>

          <label>
            Danh mục
            <select value={form.category} onChange={(event) => update('category', event.target.value)}>
              <option>iPhone</option>
              <option>Samsung</option>
              <option>Xiaomi</option>
              <option>OPPO</option>
              <option>Tablet</option>
              <option>Laptop</option>
              <option>Tai nghe</option>
              <option>Tai nghe có dây</option>
              <option>Sạc dự phòng</option>
            </select>
          </label>

          <label>
            Tồn kho
            <input type="number" value={form.stock} onChange={(event) => update('stock', event.target.value)} />
          </label>

          <label className="wide">
            Link hình ảnh
            <input value={form.image} onChange={(event) => update('image', event.target.value)} />
          </label>

          <label className="wide">
            Thông số kỹ thuật
            <textarea
              value={form.specifications || ''}
              onChange={(event) => update('specifications', event.target.value)}
              placeholder={'Màn hình: ...\nDung lượng: ...\nKết nối: ...'}
              rows={4}
            />
            <small>Mỗi dòng nhập theo dạng “Tên thông số: Giá trị”.</small>
          </label>
        </div>

        <div className="form-actions">
          <button className="outline-btn" onClick={onClose}>Hủy</button>
          <button className="primary-btn" onClick={() => onSubmit(form)}>
            <Check size={17} /> Lưu sản phẩm
          </button>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
