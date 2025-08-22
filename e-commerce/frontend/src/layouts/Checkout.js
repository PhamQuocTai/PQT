import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GET_ID_NEW, POST_NEW } from '../api/apiService';
// Import logo từ src/assets/images
import vietcombankLogo from "../assets/images/vietcombank.png";
import techcombankLogo from "../assets/images/techcombank.png";
import bidvLogo from "../assets/images/bidv.png";
import acbLogo from "../assets/images/acb.png";
import vpbankLogo from "../assets/images/vpbank.png";
import vietinbankLogo from "../assets/images/vietinbank.png";
import sacombankLogo from "../assets/images/sacombank.png";
import mbbankLogo from "../assets/images/mbbank.png";

// Hàm format ngày giờ: 2025-08-18 21:35:12
const formatDateTime = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [orderData, setOrderData] = useState({
    email: '',
    orderItems: [],
    orderDate: formatDateTime(new Date()), 
    payment: { paymentMethod: 'CASH_ON_DELIVERY' },
    totalAmount: 0,
    orderStatus: 'PENDING'
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    paymentMethod: 'CASH_ON_DELIVERY',
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bank: ''
  });

  const banks = [
    { name: "Vietcombank", logo: vietcombankLogo },
    { name: "Techcombank", logo: techcombankLogo },
    { name: "BIDV", logo: bidvLogo },
    { name: "ACB", logo: acbLogo },
    { name: "VPBank", logo: vpbankLogo },
    { name: "VietinBank", logo: vietinbankLogo },
    { name: "Sacombank", logo: sacombankLogo },
    { name: "MB Bank", logo: mbbankLogo },
  ];

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/login'); return; }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;

      const userResponse = await GET_ID_NEW(`public/users/email/${encodeURIComponent(email)}`);
      if (userResponse && userResponse.cart && userResponse.cart.cartId) {
        const cartId = userResponse.cart.cartId;
        setCartId(cartId);

        const cartResponse = await GET_ID_NEW(`public/user/${encodeURIComponent(email)}/carts/${cartId}`);
        if (cartResponse) {
          setCartData(cartResponse);

          const orderItems = cartResponse.products.map(product => ({
            product: {
              productId: product.productId,
              productName: product.productName,
              category: product.category,
              image: product.image,
              description: product.description,
              quantity: product.quantity,
              price: product.price,
              discount: product.discount,
              specialPrice: product.specialPrice
            },
            quantity: product.cartQuantity,
            discount: product.discount,
            orderedProductPrice: product.price
          }));

          setOrderData(prev => ({
            ...prev,
            email,
            orderItems,
            totalAmount: cartResponse.totalPrice,
            orderDate: formatDateTime(new Date())
          }));

          setFormData(prev => ({
            ...prev,
            firstName: userResponse.firstName || '',
            lastName: userResponse.lastName || '',
            email: userResponse.email || '',
            phone: userResponse.mobileNumber || ''
          }));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
      alert('Có lỗi xảy ra khi tải thông tin giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cardHolderName' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!cartId) { alert('Không tìm thấy giỏ hàng'); return; }

      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/login'); return; }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;

      const finalOrderData = {
        ...orderData,
        payment: {
          paymentMethod: formData.paymentMethod,
          cardHolderName: formData.cardHolderName,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          bank: formData.bank
        },
        shippingAddress: {
          city: formData.city,
          district: formData.district,
          address: formData.address
        },
        orderDate: formatDateTime(new Date())
      };

      await POST_NEW(
        `public/users/${encodeURIComponent(email)}/carts/${cartId}/payments/${formData.paymentMethod}/order`,
        finalOrderData
      );

      alert('Đặt hàng thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert('Có lỗi xảy ra khi đặt hàng');
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="section-content padding-y">
      <div className="container" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleSubmit}>
          {/* Thông tin giao hàng */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Thông tin giao hàng</h4>
              <p><strong>Ngày tạo đơn:</strong> {orderData.orderDate}</p>

              <div className="form-row">
                <div className="col form-group">
                  <label>Họ</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col form-group">
                  <label>Tên</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="col form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    readOnly
                  />
                </div>
                <div className="col form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Tỉnh/Thành phố</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Quận/Huyện</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ chi tiết</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Phương thức thanh toán</h4>
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="cod">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className="custom-control custom-radio mt-2">
                  <input
                    type="radio"
                    id="banking"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="banking">
                    Thẻ / Chuyển khoản ngân hàng
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="mt-3">
                  {/* Chọn ngân hàng dạng card */}
                  <div className="form-group">
                    <label>Chọn ngân hàng</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                      {banks.map((bank, idx) => (
                        <label key={idx} htmlFor={`bank-${idx}`} style={{
                          border: formData.bank === bank.name ? '2px solid #007bff' : '1px solid #ddd',
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: formData.bank === bank.name ? '#eaf3ff' : '#fff',
                          transition: 'all 0.2s'
                        }}>
                          <input 
                            type="radio" 
                            id={`bank-${idx}`}
                            name="bank"
                            value={bank.name}
                            checked={formData.bank === bank.name}
                            onChange={handleInputChange}
                            style={{ display: 'none' }}
                            required
                          />
                          <img src={bank.logo} alt={bank.name} style={{ height: '40px', marginBottom: '8px', objectFit: 'contain' }} />
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>{bank.name}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tên chủ thẻ (IN HOA)</label>
                    <input type="text" className="form-control" name="cardHolderName" value={formData.cardHolderName} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Số thẻ</label>
                    <input type="text" className="form-control" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required />
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Ngày hết hạn</label>
                      <input type="month" className="form-control" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Mã bảo mật (CVV)</label>
                      <input type="password" className="form-control" name="cvv" value={formData.cvv} onChange={handleInputChange} required />
                    </div>
                  </div>

                  {/* Preview thẻ */}
                  <div className="mt-4 p-3" style={{
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff',
                    maxWidth: '350px'
                  }}>
                    <div style={{ fontSize: '14px', marginBottom: '12px' }}>{formData.bank || 'Ngân hàng'}</div>
                    <div style={{ fontSize: '18px', letterSpacing: '2px', marginBottom: '12px' }}>
                      {formData.cardNumber ? formData.cardNumber.replace(/\d(?=\d{4})/g, "*") : '**** **** **** ****'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <div>
                        <div>CHỦ THẺ</div>
                        <div>{formData.cardHolderName || 'HỌ TÊN'}</div>
                      </div>
                      <div>
                        <div>HSD</div>
                        <div>{formData.expiryDate || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tổng quan đơn hàng */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Tổng quan đơn hàng</h4>
              <table className="table">
                <tbody>
                  {orderData.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product.productName} x {item.quantity}</td>
                      <td className="text-right">{(item.orderedProductPrice * item.quantity).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Tổng thanh toán:</strong></td>
                    <td className="text-right"><strong>{orderData.totalAmount?.toLocaleString('vi-VN')}đ</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">Xác nhận đặt hàng</button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
