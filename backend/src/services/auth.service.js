import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerManager = async (data) => {
  const {
    fullName,
    mobile,
    password,
    buildingName,
    postalCode,
    address,
  } = data;

  const existingBuilding = await prisma.building.findUnique({
    where: {
      postalCode,
    },
    include: {
      users: true,
    },
  });

  if (existingBuilding) {
    const managerExists = existingBuilding.users.find(
      (user) => user.role === "PURCHASE_MANAGER"
    );

    if (managerExists) {
      throw new Error(
        `ساختمان ${existingBuilding.buildingName}  مسئول خرید دارد.`
      );
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const building =
    existingBuilding ||
    (await prisma.building.create({
      data: {
        buildingName,
        postalCode,
        address,
      },
    }));

  const manager = await prisma.user.create({
    data: {
      fullName,
      mobile,
      password: hashedPassword,
      role: "PURCHASE_MANAGER",
      buildingId: building.buildingId,
    },
  });

  return {
    success: true,
    message: `${manager.fullName} عزیز، شما مسئول خرید ساختمان ${building.buildingName} هستید.`,
  };
};



export const registerUser = async (data) => {
  const {
    fullName,
    mobile,
    password,
    postalCode,
    floorNumber,
    unitNumber,
  } = data;

  const building = await prisma.building.findUnique({
    where: { postalCode },
  });

  if (!building) {
    throw new Error(
      "هنوز ساختمانی با این کدپستی و مسئول خرید ثبت نشده است."
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { mobile },
  });

  if (existingUser) {
    throw new Error("این شماره تماس قبلاً ثبت شده است.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  
  const user = await prisma.user.create({
    data: {
      fullName,
      mobile,
      password: hashedPassword,
      role: "RESIDENT",
      floorNumber,
      unitNumber,
      buildingId: building.buildingId,
    },
  });

  
  return {
    success: true,
    message: `${fullName} عزیز، شما عضو ساختمان ${building.buildingName} شدید.`,
    user,
  };
};






export const login = async (data) => {

 const { mobile, password } = data;
 
  console.log("DATA:", data);
  const user = await prisma.user.findUnique({
    where: { mobile },
  });

console.log("USER:", user);

  if (!user) {
    throw new Error("کاربر پیدا نشد");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("رمز اشتباه است");
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      role: user.role,
      buildingId: user.buildingId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    success: true,
    token,
    user: {
      userId: user.userId,
      fullName: user.fullName,
      role: user.role,
    },
  }

 };
