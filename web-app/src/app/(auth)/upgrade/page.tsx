import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export default function UpgradePage() {
  return (
    <div className="flex min-h-[calc(100dvh-7.1rem)] items-center justify-center">
      <Card className="min-h-[600px] max-w-[400px]">
        <CardHeader>
          <h1 className="w-full text-center text-2xl font-bold">Upgrade</h1>
        </CardHeader>
        <CardBody>
          <p className="w-full text-center text-lg">
            Upgrade your account to premium to unlock more features
          </p>
        </CardBody>
        <CardFooter className="bg-foreground/10">
          <p className="w-full text-center text-sm text-muted-foreground">
            This feature is not available yet
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
