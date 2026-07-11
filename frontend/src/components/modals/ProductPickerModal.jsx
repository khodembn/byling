import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { getImageUrl } from "../../utils/imageUrl";

import "../../styles/ProductPicker.css";

export default function ProductPickerModal({

    open,

    onClose,

    onSelect,
    campaignProducts,
}) {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        if (!open) return;

        const fetchProducts = async () => {

            const data = await getProducts();

            setProducts(data);

        };

        fetchProducts();

    }, [open]);

    if (!open) return null;
    const isAlreadyAdded = (productId) => {

        return campaignProducts.some(

            item => item.productId === productId

        );

    };

    const filteredProducts = products.filter((product) =>

        product.productName
            .toLowerCase()
            .includes(search.toLowerCase())

    );

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    انتخاب محصول

                </h2>
                <input

                    type="text"

                    placeholder="جستجوی محصول..."

                    value={search}

                    onChange={(e) =>

                        setSearch(e.target.value)

                    }

                />
                {filteredProducts.map((product) => (

                    <div
                        key={product.productId}
                        className="product-card"
                    >
                        <div className="product-left">

                            <div className="product-image">

                                {product.imageUrl ? (

                                    <img
                                        src={getImageUrl(product.imageUrl)}
                                        alt={product.productName}
                                    />

                                ) : (

                                    <div className="product-placeholder">
                                        📦
                                    </div>

                                )}

                            </div>

                            <div className="product-info">

                                <h3>{product.productName}</h3>

                                <p>{product.description}</p>

                                <div className="product-meta">

                                    <span>
                                        واحد:
                                        {product.unit}
                                    </span>

                                    <span>
                                        وزن:
                                        {product.weightPerUnit}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <button

                            className="select-btn"

                            disabled={isAlreadyAdded(product.productId)}

                            onClick={() => onSelect(product)}

                        >

                            {

                                isAlreadyAdded(product.productId)

                                    ?

                                    "قبلاً اضافه شده"

                                    :

                                    "انتخاب"

                            }

                        </button>

                    </div>

                ))}


                <button

                    onClick={onClose}

                >

                    بستن

                </button>

            </div>

        </div>

    );

}