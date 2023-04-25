import { useState } from "react";

const ProductForm = () => {
  // Your component logic and JSX will go here
  const defaultProperties = {
    furniture: [
      { name: "Material", value: "Wood" },
      { name: "Dimensions", value: "200cm x 300cm" },
    ],
    electronics: [
      { name: "Power", value: "70W" },
      { name: "Voltage", value: "220V" },
    ],
    custom: [],
  };

  const [productType, setProductType] = useState("furniture");
  const [properties, setProperties] = useState(defaultProperties.furniture);
  const [propertyErrors, setPropertyErrors] = useState([]);
  const [output, setOutput] = useState("");
  const [handle, setHandle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleProductTypeChange = (type) => {
    setProductType(type);
    setProperties(defaultProperties[type]);
  };
  const handlePropertyNameChange = (index, name) => {
    const updatedProperties = [...properties];
    updatedProperties[index].name = name;
    setProperties(updatedProperties);
  };

  const handlePropertyValueChange = (index, value) => {
    const updatedProperties = [...properties];
    updatedProperties[index].value = value;
    setProperties(updatedProperties);
  };

  const addProperty = () => {
    setProperties([...properties, { name: "", value: "" }]);
  };

  const generateOutput = () => {
    const errors = properties.map((property) => ({
      name: property.name.trim() === "",
      value: property.value.trim() === "",
    }));

    setPropertyErrors(errors);

    if (errors.some((error) => error.name || error.value)) {
      return;
    }

    const outputJSON = properties.reduce((acc, property) => {
      if (property.name.trim() !== "" && property.value.trim() !== "") {
        acc[property.name] = property.value;
      }
      return acc;
    }, {});

    setOutput(JSON.stringify(outputJSON, null, 2));
  };

  const minifyOutput = () => {
    const outputJSON = JSON.parse(output);
    setOutput(JSON.stringify(outputJSON));
  };

  const removeProperty = (index) => {
    const updatedProperties = properties.filter((_, i) => i !== index);
    setProperties(updatedProperties);

    const updatedErrors = propertyErrors.filter((_, i) => i !== index);
    setPropertyErrors(updatedErrors);
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${handle}`);
      const data = await response.json();

      if (response.ok) {
        setErrorMessage("");
        setProductType("custom");
        setProperties(data.properties || []);
      } else {
        setErrorMessage(
          data.message || "An error occurred while fetching the product."
        );
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching the product.");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Properties Editor</h1>
      <form>
        <div className="mb-4 flex justify-start align-middle flex-wrap">
          <label htmlFor="handle" className="py-2 inline-block mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto">
            Product Handle:
          </label>
          <input
            type="text"
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full sm:w-1/4 p-2 border border-gray-300 rounded"
            placeholder="Enter product handle"
          />
          <button
            type="button"
            onClick={fetchProduct}
            className="bg-green-500 text-white px-4 py-2 mt-4 sm:mt-0 sm:ml-2 w-full sm:w-auto rounded"
          >
            Fetch Product
          </button>
          {errorMessage && (
            <div className="bg-red-100 border mt-4 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
        </div>
        <div className="mb-4 flex justify-start">
          <label htmlFor="productType" className="block mr-2 py-2">
            Product Type:
          </label>
          <select
            id="productType"
            value={productType}
            onChange={(e) => handleProductTypeChange(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded"
          >
            <option value="furniture">Furniture</option>
            <option value="electronics">Electronics</option>
            <option value="custom">Custom Product</option>
          </select>
        </div>
        {properties.map((property, index) => (
          <div key={index} className="mb-4 flex flex-wrap justify-start">
            <div className="w-full sm:w-auto sm:pr-2 flex">
              <label htmlFor={`property-name-${index}`} className="block p-0 sm:py-1 mb-1 sm:mb-0 sm:mr-2">
                Name:
              </label>
              <input
                type="text"
                id={`property-name-${index}`}
                value={property.name}
                onChange={(e) =>
                  handlePropertyNameChange(index, e.target.value)
                }
                className={`w-full p-1 border ${
                  propertyErrors[index]?.name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded`}
                placeholder="Property Name"
              />
            </div>
            <div className="w-full sm:w-auto sm:pl-2 flex">
              <label htmlFor={`property-value-${index}`} className="block p-0 sm:py-1 mb-1 sm:mb-0 sm:mr-2">
                Value:
              </label>
              <input
                type="text"
                id={`property-value-${index}`}
                value={property.value}
                onChange={(e) =>
                  handlePropertyValueChange(index, e.target.value)
                }
                className={`w-full p-1 border ${
                  propertyErrors[index]?.value
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded`}
                placeholder="Property Value"
              />
            </div>
            <button
              type="button"
              onClick={() => removeProperty(index)}
              className="ml-2 mt-4 sm:mt-0 w-full sm:w-1/12 text-red-500 border border-red-500 p-0 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProperty}
          className="bg-green-500 text-white px-4 py-2 rounded mr-4"
        >
          Add Property
        </button>
        <button
          type="button"
          onClick={generateOutput}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate JSON
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Output JSON</h2>
        <pre className="bg-gray-100 p-4 rounded">{output}</pre>
      </div>
      <button
        type="button"
        onClick={minifyOutput}
        className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
      >
        Minify JSON
      </button>
    </div>
  );
};

export default ProductForm;
