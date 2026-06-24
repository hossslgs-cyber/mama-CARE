'use client';

import { JSX } from 'react';
import MaternalJourney from '@/components/login/MaternalJourney';
import JourneyProgress from '@/components/login/JourneyProgress';
import LoginCard from '@/components/login/LoginCard';
import { useLogin } from '@/hooks/useLogin';

export default function LoginPage(): JSX.Element {
  const {
    method,
    message,
    submitting,
    phone,
    pin,
    email,
    password,
    switchMethod,
    dismissMessage,
    setPhone,
    setPin,
    setEmail,
    setPassword,
    handlePhoneSubmit,
    handleEmailSubmit,
  } = useLogin();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0f1e] p-5">
      <MaternalJourney />
      <JourneyProgress activeStep={0} />
      <LoginCard
        method={method}
        message={message}
        submitting={submitting}
        phone={phone}
        pin={pin}
        email={email}
        password={password}
        onMethodChange={switchMethod}
        onPhoneChange={setPhone}
        onPinChange={setPin}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onPhoneSubmit={handlePhoneSubmit}
        onEmailSubmit={handleEmailSubmit}
        onDismissMessage={dismissMessage}
      />
    </main>
  );
}
