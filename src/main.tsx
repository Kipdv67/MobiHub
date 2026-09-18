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
  Menu,
  Package,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Star,
  Tag,
  Trash2,
  Truck,
  Users,
  X,
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
}

type Order = {
  id: string
  customer: string
  phone: string
  address: string
  payment: CheckoutPayload['payment']
  item: string
  items: Array<{ name: string; price: number }>
  amount: number
  status: 'Đang xử lý' | 'Đang giao' | 'Hoàn tất'
  time: string
}

type CheckoutPayload = {
  customer: string
  phone: string
  address: string
  payment: 'COD' | 'Momo' | 'Banking' | 'Card'
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
})

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mobihub-products')
      return saved ? JSON.parse(saved) : seedProducts
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
  const [cart, setCart] = useState<Product[]>([])
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

  const loginCustomer = (customer: Customer) => {
    setCurrentCustomer(customer)
    localStorage.setItem('mobihub-current-customer', JSON.stringify(customer))
  }

  const logoutCustomer = () => {
    setCurrentCustomer(null)
    localStorage.removeItem('mobihub-current-customer')
    setShowOrderHistory(false)
    notify('Đã đăng xuất tài khoản khách hàng')
  }

  const openAdmin = () => {
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

  const categories = ['Tất cả', 'iPhone', 'Samsung', 'Xiaomi', 'OPPO', 'Tablet', 'Laptop']
  const filtered = useMemo(
    () =>
      products.filter(
        (item) =>
          (category === 'Tất cả' || item.category === category) &&
          `${item.name} ${item.brand}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, category, query],
  )

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const addToCart = (product: Product) => {
    setCart((items) => [...items, product])
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
            <span>Trung tâm hỗ trợ</span>
            <span>Kiểm tra đơn hàng</span>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-inner">
          <button className="menu-button" aria-label="Mở trang quản trị" onClick={() => mode === 'admin' ? setMode('store') : openAdmin()}>
            <Menu size={20} />
          </button>

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
            <button className={mode === 'admin' ? 'active' : ''} onClick={openAdmin}>
              <LayoutDashboard size={15} /> Quản trị
            </button>
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
              <b>{cart.length}</b>
              <span>Giỏ hàng</span>
            </button>
          </div>
        </div>
      </nav>

      {mode === 'store' ? (
        <StoreView categories={categories} category={category} setCategory={setCategory} filtered={filtered} addToCart={addToCart} setSelected={setSelected} />
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
            notify('Đã xóa sản phẩm')
          }}
        />
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} addToCart={addToCart} />}
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          remove={(index) => setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))}
          checkout={(payload: CheckoutPayload) => {
            const total = cart.reduce((sum, item) => sum + item.price, 0)
            const orderItems = cart.map((item) => ({ name: item.name, price: item.price }))
            const itemNames = orderItems.map((item) => item.name).slice(0, 2).join(', ')

            const newOrder: Order = {
              id: `#MH-${Date.now().toString().slice(-5)}`,
              customer: payload.customer,
              phone: payload.phone,
              address: payload.address,
              payment: payload.payment,
              item: cart.length > 2 ? `${itemNames} + ${cart.length - 2} sản phẩm` : itemNames || 'Sản phẩm',
              items: orderItems,
              amount: total,
              status: 'Đang xử lý',
              time: 'Vừa xong',
            }

            updateOrders([newOrder, ...orders])
            setShowCart(false)
            setCart([])
            notify(`Đặt hàng thành công cho ${payload.customer}. Thanh toán: ${payload.payment}`)
          }}
        />
      )}
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
  filtered,
  addToCart,
  setSelected,
}: {
  categories: string[]
  category: string
  setCategory: (value: string) => void
  filtered: Product[]
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
              <strong>2.000+</strong>
              <small>Sản phẩm chính hãng</small>
            </span>
            <span>
              <strong>4.9/5</strong>
              <small>Đánh giá khách hàng</small>
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
          <button className="text-btn">
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

        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} setSelected={setSelected} />
          ))}
        </div>
      </section>
    </main>
  )
}

function ProductCard({
  product,
  addToCart,
  setSelected,
}: {
  product: Product
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
          <Star size={14} fill="currentColor" /> {product.rating} <span>·</span> <span>{product.stock} sản phẩm</span>
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
  onClose,
  addToCart,
}: {
  product: Product
  onClose: () => void
  addToCart: (product: Product) => void
}) {
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
            <Star size={15} fill="currentColor" /> {product.rating} · Đã bán 128
          </div>
          <div className="modal-price">
            {money(product.price)} <del>{money(product.oldPrice)}</del>
          </div>
          <p>Thiết kế cao cấp, hiệu năng mạnh mẽ và bảo hành chính hãng. Tặng kèm gói bảo vệ toàn diện khi mua hôm nay.</p>
          <div className="modal-actions">
            <button className="primary-btn" onClick={() => { addToCart(product); onClose() }}>
              Thêm vào giỏ <ShoppingCart size={17} />
            </button>
            <button className="outline-btn" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({
  cart,
  onClose,
  remove,
  checkout,
}: {
  cart: Product[]
  onClose: () => void
  remove: (index: number) => void
  checkout: (payload: CheckoutPayload) => void
}) {
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const [isCheckoutForm, setIsCheckoutForm] = useState(false)
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<CheckoutPayload['payment']>('COD')
  const [errors, setErrors] = useState<{ customer?: string; phone?: string; address?: string }>({})

  const submitOrder = () => {
    const nextErrors = {
      customer: customer.trim() ? undefined : 'Vui lòng nhập họ và tên',
      phone: phone.trim() ? undefined : 'Vui lòng nhập số điện thoại',
      address: address.trim() ? undefined : 'Vui lòng nhập địa chỉ giao hàng',
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    checkout({ customer: customer.trim(), phone: phone.trim(), address: address.trim(), payment })
  }

  return (
    <div className="overlay drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="section-kicker">Đơn hàng của bạn</span>
            <h2>
              Giỏ hàng <span>({cart.length})</span>
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
                Địa chỉ giao hàng
                <input className={errors.address ? 'input-error' : ''} value={address} onChange={(event) => { setAddress(event.target.value); setErrors((current) => ({ ...current, address: undefined })) }} placeholder="123 Lê Lợi, Q.1, TP.HCM" />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </label>
              <label>
                Phương thức thanh toán
                <select value={payment} onChange={(event) => setPayment(event.target.value as CheckoutPayload['payment'])}>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="Momo">Ví Momo</option>
                  <option value="Banking">Chuyển khoản ngân hàng</option>
                  <option value="Card">Thẻ tín dụng / ghi nợ</option>
                </select>
              </label>
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
            <div className="cart-items">
              {cart.map((product, index) => (
                <div className="cart-item" key={`${product.id}-${index}`}>
                  <img src={product.image} alt="" />
                  <div>
                    <b>{product.name}</b>
                    <span>{money(product.price)}</span>
                  </div>
                  <button onClick={() => remove(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Tạm tính</span>
                <b>{money(total)}</b>
              </div>
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
    drawField('Địa chỉ giao hàng', order.address, 80, 435)
    drawField('Thanh toán', order.payment, 760, 435)
    drawField('Trạng thái', order.status, 80, 540)

    const tableTop = 625
    context.fillStyle = '#f3f7f9'
    context.fillRect(80, tableTop, 1240, 58)
    context.fillStyle = '#58707c'
    context.font = '700 17px Arial'
    context.fillText('SẢN PHẨM', 105, tableTop + 36)
    context.fillText('ĐƠN GIÁ', 990, tableTop + 36)

    order.items.forEach((item, index) => {
      const rowTop = tableTop + 58 + index * 62
      context.fillStyle = '#102a43'
      context.font = '20px Arial'
      context.fillText(item.name, 105, rowTop + 38)
      context.fillText(money(item.price), 990, rowTop + 38)
      context.strokeStyle = '#dfe8ec'
      context.beginPath()
      context.moveTo(80, rowTop + 62)
      context.lineTo(1320, rowTop + 62)
      context.stroke()
    })

    const totalY = tableTop + 110 + order.items.length * 62
    context.fillStyle = '#718596'
    context.font = '18px Arial'
    context.fillText('Tổng cộng', 1050, totalY)
    context.fillStyle = '#102a43'
    context.font = '700 28px Arial'
    context.fillText(money(order.amount), 1050, totalY + 40)

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
            <small>Địa chỉ giao hàng</small>
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
        </div>

        <div className="invoice-body">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td>{item.name}</td>
                  <td>{money(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-foot">
          <div>
            <span>Tổng cộng</span>
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
