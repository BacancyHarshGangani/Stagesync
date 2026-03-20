import { Onboarding } from "@/context/onboarding.context";

export default function onboardinglayout(
    {children}: {children: React.ReactNode}
)
{
    return (
      <>
        <Onboarding>{children}</Onboarding>
      </>
    );
}