import { Link, useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrderDetailsQuery} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="page-info-order container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Serial Number</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.serialnumber}</td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        {new Date(order.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="p-2 text-center">
                        L.E {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Order Information</h2>
          <p className="mb-4 mt-4">
            <strong className="text-[#5f2476]">Order ID:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-[#5f2476]">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-[#5f2476]">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-[#5f2476]">Brand:</strong>{" "}
            {order.orderItems.map((item, index) => (
              <span key={index}>
                {item.brand}
                {index !== order.orderItems.length - 1 && ", "}
              </span>
            ))}
          </p>

          <p className="mb-4">
            <strong className="text-[#5f2476]">Information:</strong>{" "}
            <p>Serial Number: {order.shippingAddress.address}</p>
            <p>Product Name: {order.shippingAddress.city}</p>
            <p>Salesman: {order.shippingAddress.country}</p>
          </p>
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[1rem]">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Total number of Items</span>
          <span>{order.orderItems.reduce((acc, item) => acc + item.qty, 0)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Products Name</span>
          <span>{order.orderItems.map((item) => item.name).join(", ")}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Total Price</span>
          <span>L.E {order.itemsPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Order;
