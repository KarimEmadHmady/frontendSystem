import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice"; 
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { FiFilter } from 'react-icons/fi';
import { CSVLink } from "react-csv"; // استيراد مكتبة CSVLink
import AdminMenu from "../Admin/AdminMenu";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../../redux/features/shop/shopSlice";
import Loader from "../../components/Loader";
import ProductCard from "../Products/ProductCard"; 

const Adminproducts = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); 

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container  margine-btn-phone overflow-x-hidden ">
      <AdminMenu />
      <div className="flex md:flex-row">
        <div className={`list-filter bg-[#151515] p-3 mt-2 mb-2 transition-all duration-300 ${isFilterOpen ? "left-0" : "left-[-267px]"}`}>
          <div className="containar-filter" onClick={toggleFilter}>
            <span>filter {isFilterOpen && '❌'}</span>
            <FiFilter className="text-[#5f2476] text-2xl" />
          </div>

          {/* الفلاتر */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Categories</h2>
          <div className="p-5 w-[15rem]">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div className="flex ietms-center mr-4">
                  <input
                    type="checkbox"
                    id="red-checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-[#5f2476] bg-gray-100 border-gray-300 rounded focus:ring-[#5f2476]"
                  />
                  <label htmlFor="red-checkbox" className="ml-2 text-sm font-medium text-white">
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* الفلاتر حسب العلامة التجارية */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Brands</h2>
          <div className="p-5">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-enter mr-4 mb-5">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-[#5f2476] bg-gray-100 border-gray-300 focus:ring-[#5f2476]"
                />
                <label htmlFor={brand} className="ml-2 text-sm font-medium text-white">
                  {brand}
                </label>
              </div>
            ))}
          </div>

          {/* فلاتر حسب السعر */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filer by Price</h2>
          <div className="p-5 w-[15rem]">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-[#5f2476]"
            />
          </div>

          {/* زر إعادة تعيين الفلاتر */}
          <div className="p-5 pt-0">
            <button className="w-full border my-4" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
          
          <CSVLink
                  data={products.map((product) => ({
                    "Product Name": product.name,
                    "Serial Number": product.serialnumber,
                    "Brand": product.brand || "N/A",
                    "Date of Creation": product.createdAt,
                    "Price": `L.E ${product.price}`,
                    "Quantity": product.quantity || "N/A",
                    "Count In Stock": product.countInStock || "N/A",
                  }))}
                  filename="all_products_details.csv"
                  className="mb-4 ml-[9px] W-[100%] inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-500"
                >
                  Download All Products as CSV
          </CSVLink>
          </div>

       
        <div className="p-3 container-products-shoppage page-rtl">
          <h2 className={`h4 text-center mb-2 ${isFilterOpen ? "opacity-5" : "opacity-100"}`}>{products?.length} Products</h2> 
          <div className={`flex flex-wrap justify-center ${isFilterOpen ? "opacity-5" : "opacity-100"}`}>
            {products.length === 0 ? (
              <Loader className="text-center" />
            ) : (
              <>
                {products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminproducts;
