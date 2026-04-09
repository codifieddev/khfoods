import { connectMasterDB, connectTenantDB } from "../lib/db";

export const getUserModel = async () => {
  const db = await connectMasterDB();
  return db.collection("users");
};

export const getTenantsCollection = async () => {
  const db = await connectMasterDB();
  return db.collection("tenants");
};

export const getCategoryModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: categories");
  return db.collection("categories");
};

export const getAttributeSetModel = async () => {
  const db = await connectTenantDB();
  return db.collection("attribute_sets");
};

export const getProductModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: products");
  return db.collection("products");
};

export const getVariantModel = async () => {
  const db = await connectTenantDB();
  return db.collection("variants");
};

export const getOrderModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: orders");
  return db.collection("orders");
};

export const getCustomerModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: customers");
  return db.collection("customers");
};

export const getCartModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: carts");
  return db.collection("carts");
};

export const getMediaModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: media");
  return db.collection("media");
};

export const getCouponModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: coupons");
  return db.collection("coupons");
};

export const getReviewModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: reviews");
  return db.collection("reviews");
};

export const getAttributeModel = async () => {
  const db = await connectTenantDB();
  console.log("📦 Collection Ready: attributes");
  return db.collection("attributes");
};

export const getPageModel = async () => {
  const db = await connectTenantDB();
  return db.collection("pages");
};

export const getFormModel = async () => {
  const db = await connectTenantDB();
  return db.collection("forms");
};

export const getFormSubmissionModel = async () => {
  const db = await connectTenantDB();
  return db.collection("form_submissions");
};
