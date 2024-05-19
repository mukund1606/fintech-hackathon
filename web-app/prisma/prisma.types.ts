declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type PaymentOption = {
      name: "CreditCard" | "DebitCard" | "Cash" | "UPI";
      cardName: string;
    }[];
  }
}
