const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // langsung masuk dashboard tanpa Firestore
    navigate("/dashboard");

  } catch (err: any) {
    console.error(err);
    setError("Email atau password salah. Silakan coba lagi.");
  } finally {
    setLoading(false);
  }
};