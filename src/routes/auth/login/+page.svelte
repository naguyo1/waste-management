<!-- src/routes/auth/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Recycle, Eye, EyeOff, Loader2 } from 'lucide-svelte';

  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let error = '';

  async function handleLogin() {
    error = '';
    if (!email.trim() || !password) { error = 'Please enter your email and password'; return; }
    loading = true;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { error = data.message ?? 'Invalid email or password'; return; }
      const redirectTo = $page.url.searchParams.get('redirectTo') ?? data.data.redirectTo;
      await goto(redirectTo);
    } catch { error = 'Network error. Please try again.';
    } finally { loading = false; }
  }

  function handleKeydown(e: KeyboardEvent) { if (e.key === 'Enter') handleLogin(); }
</script>

<svelte:head><title>Sign In — WasteLink</title></svelte:head>

<div class="auth-page">
  <div class="auth-left">
    <div class="auth-left-content">
      <div class="al-logo"><div class="al-icon"><Recycle size={24}/></div><span>WasteLink Uganda</span></div>
      <h2>Managing Kampala's waste — one pickup at a time</h2>
      <p>The smart platform connecting households, collectors, and recyclers across Uganda.</p>
      <div class="al-roles">
        <div class="ar-item"><span>🏠</span><div><strong>Households</strong><span>Schedule pickups easily</span></div></div>
        <div class="ar-item"><span>🚛</span><div><strong>Collectors</strong><span>Accept jobs, earn income</span></div></div>
        <div class="ar-item"><span>♻️</span><div><strong>Recyclers</strong><span>Bid on collected waste</span></div></div>
        <div class="ar-item"><span>🏙️</span><div><strong>City Authority</strong><span>Monitor & manage the system</span></div></div>
        <div class="ar-item"><span>🏙️</span><div><strong>Github Actions</strong><span>Testing github actions integration</span></div></div>
      </div>
    </div>
  </div>

  <div class="auth-right">
    <div class="auth-box animate-fade-in-up">
      <a href="/" class="box-logo"><div class="bl-icon"><Recycle size={16}/></div><span>WasteLink</span></a>
      <h1>Welcome back</h1>
      <p class="auth-sub">Sign in to your account to continue</p>

      {#if error}<div class="auth-error">{error}</div>{/if}

      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="auth-form" role="form" on:keydown={handleKeydown}>
        <div class="form-group">
          <label class="label" for="email">Email address</label>
          <input id="email" type="email" class="input" bind:value={email} placeholder="you@example.com" autocomplete="email"/>
        </div>
        <div class="form-group">
          <div class="pw-label">
            <label class="label" for="pw">Password</label>
            <a href="/auth/forgot-password" class="forgot-link">Forgot?</a>
          </div>
          <div class="input-wrap">
            <input id="pw" type={showPassword ? 'text' : 'password'} class="input pr-input"
              bind:value={password} placeholder="Your password" autocomplete="current-password"/>
            <button type="button" class="toggle-pw" on:click={() => showPassword = !showPassword} aria-label="Toggle">
              {#if showPassword}<EyeOff size={15}/>{:else}<Eye size={15}/>{/if}
            </button>
          </div>
        </div>
        <button class="btn-primary login-btn" on:click={handleLogin} disabled={loading}>
          {#if loading}<Loader2 size={16} class="spin"/> Signing in...{:else}Sign In{/if}
        </button>
      </div>

      <p class="auth-footer">
        New household? <a href="/auth/register">Create account</a>
      </p>
    </div>
  </div>
</div>

<style>
  .auth-page { min-height:100vh;display:flex; }
  .auth-left { width:45%;background:linear-gradient(160deg,#064e3b 0%,#059669 60%,#0d9488 100%);display:flex;align-items:center;justify-content:center;padding:3rem;color:white; }
  @media(max-width:768px){ .auth-left { display:none; } }
  .auth-left-content { max-width:340px; }
  .al-logo { display:flex;align-items:center;gap:.625rem;font-family:var(--font-display);font-size:1.125rem;font-weight:800;margin-bottom:2rem;letter-spacing:-.03em; }
  .al-icon { width:36px;height:36px;background:rgba(255,255,255,.2);border-radius:9px;display:flex;align-items:center;justify-content:center; }
  .auth-left-content h2 { font-size:1.625rem;font-weight:800;line-height:1.25;letter-spacing:-.03em;margin:0 0 .75rem; }
  .auth-left-content > p { color:rgba(255,255,255,.8);font-size:.9375rem;line-height:1.6;margin:0 0 2rem; }
  .al-roles { display:flex;flex-direction:column;gap:.625rem; }
  .ar-item { display:flex;align-items:center;gap:.75rem;padding:.75rem;background:rgba(255,255,255,.1);border-radius:.75rem;border:1px solid rgba(255,255,255,.12); }
  .ar-item span:first-child { font-size:1.25rem;flex-shrink:0; }
  .ar-item strong { display:block;font-size:.875rem;font-weight:700;margin-bottom:.1rem; }
  .ar-item span:last-child { font-size:.75rem;color:rgba(255,255,255,.75); }
  .auth-right { flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;background:#f8fafc;overflow-y:auto; }
  .auth-box { width:100%;max-width:420px;background:white;border:1px solid #e2e8f0;border-radius:1.25rem;padding:2.5rem;box-shadow:0 4px 32px rgba(0,0,0,.06); }
  .box-logo { display:flex;align-items:center;gap:.5rem;text-decoration:none;font-family:var(--font-display);font-size:.9375rem;font-weight:800;color:#0f172a;margin-bottom:1.5rem;letter-spacing:-.02em; }
  .bl-icon { width:28px;height:28px;background:linear-gradient(135deg,#059669,#0d9488);border-radius:7px;display:flex;align-items:center;justify-content:center;color:white; }
  .auth-box h1 { font-size:1.5rem;font-weight:800;color:#0f172a;margin:0 0 .3rem;letter-spacing:-.03em; }
  .auth-sub { font-size:.875rem;color:#64748b;margin:0 0 1.5rem; }
  .auth-error { background:#fee2e2;border:1px solid #fca5a5;color:#991b1b;padding:.75rem 1rem;border-radius:8px;font-size:.875rem;margin-bottom:1.25rem; }
  .auth-form { display:flex;flex-direction:column;gap:.875rem; }
  .form-group { display:flex;flex-direction:column;gap:.3rem; }
  .pw-label { display:flex;align-items:center;justify-content:space-between; }
  .forgot-link { font-size:.75rem;color:#059669;font-weight:600;text-decoration:none; }
  .input-wrap { position:relative; }
  .pr-input { padding-right:2.5rem; }
  .toggle-pw { position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#94a3b8;cursor:pointer;display:flex;align-items:center; }
  .login-btn { width:100%;justify-content:center;padding:.75rem;font-size:.9375rem;margin-top:.25rem;display:flex;align-items:center;gap:.5rem; }
  .login-btn:disabled { opacity:.7;cursor:not-allowed;transform:none; }
  .auth-footer { text-align:center;font-size:.875rem;color:#64748b;margin-top:1.25rem; }
  .auth-footer a { color:#059669;font-weight:600;text-decoration:none; }
  :global(.spin) { animation:spin 1s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
</style>
