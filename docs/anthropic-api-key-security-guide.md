# Secure Patterns for Anthropic API Keys in Client-Side Web Applications

## Executive Summary

This guide provides comprehensive security patterns for handling
Anthropic API keys in client-side web applications, focusing on BYOK
(Bring Your Own Key) implementations, alternative architectures, and
real-world security practices.

## Table of Contents

1. [Official Anthropic Guidance](#official-anthropic-guidance)
2. [BYOK Implementation Patterns](#byok-implementation-patterns)
3. [Alternative Security Architectures](#alternative-security-architectures)
4. [Real-World Examples from Developer Tools](#real-world-examples)
5. [Security Recommendations Matrix](#security-recommendations-matrix)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Security Warnings and User Education](#security-warnings)

---

## Official Anthropic Guidance

### API Key Security Best Practices

According to Anthropic's official documentation, API keys enable
access to Anthropic Services but pose significant security risks if
not handled properly:

**Key Recommendations:**

- Never share API keys publicly or commit them to version control
- Use environment variables for secure handling in server environments
- Implement regular key rotation
- Use separate keys for different environments (dev, staging,
  production)
- Employ secret scanning in development workflows
- Utilize Key Management Systems (KMS) for centralized credential
  management

### CORS Support and Client-Side Implications

As of August 2024, Anthropic introduced CORS support for their API,
enabling direct client-side calls. However, this comes with
significant security considerations:

**Security Concerns:**

- Direct exposure of API keys in client-side code
- Risk of unauthorized usage and charges
- Potential for key extraction from browser environments

**Valid Use Cases:**

- Internal tools with controlled access
- User-supplied API key scenarios (BYOK)
- Prototyping and development environments

---

## BYOK Implementation Patterns

### Pattern 1: Encrypted Client-Side Storage

**Implementation:**

```javascript
// Secure storage using Web Crypto API
async function encryptApiKey(key, userPassword) {
	const encoder = new TextEncoder();
	const data = encoder.encode(key);
	const passwordKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(userPassword),
		{ name: 'PBKDF2' },
		false,
		['deriveBits', 'deriveKey'],
	);

	const derivedKey = await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: crypto.getRandomValues(new Uint8Array(16)),
			iterations: 100000,
			hash: 'SHA-256',
		},
		passwordKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt'],
	);

	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encrypted = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: iv },
		derivedKey,
		data,
	);

	return { encrypted, iv, salt };
}
```

**Security Features:**

- Client-side encryption using Web Crypto API
- Password-based key derivation (PBKDF2)
- No plaintext storage in localStorage/sessionStorage
- User-controlled encryption keys

### Pattern 2: Session-Based Temporary Storage

**Implementation:**

```javascript
class SecureApiKeyManager {
	constructor() {
		this.apiKey = null;
		this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
		this.lastActivity = Date.now();
	}

	setApiKey(key) {
		this.apiKey = key;
		this.lastActivity = Date.now();
		this.scheduleCleanup();
	}

	getApiKey() {
		if (this.isExpired()) {
			this.clearApiKey();
			return null;
		}
		this.lastActivity = Date.now();
		return this.apiKey;
	}

	isExpired() {
		return Date.now() - this.lastActivity > this.sessionTimeout;
	}

	clearApiKey() {
		this.apiKey = null;
		this.lastActivity = 0;
	}

	scheduleCleanup() {
		setTimeout(() => {
			if (this.isExpired()) {
				this.clearApiKey();
			}
		}, this.sessionTimeout);
	}
}
```

**Security Features:**

- In-memory storage only
- Automatic expiration and cleanup
- No persistent storage
- Session-based lifecycle management

### Pattern 3: Postman-Style BYOK with Enterprise Encryption

**Key Features (based on Postman's BYOK implementation):**

- Customer-managed encryption keys stored in AWS KMS
- End-to-end encryption of sensitive data
- Enterprise-grade key management
- Audit trails and compliance features

**Implementation Concept:**

```javascript
class EnterpriseApiKeyManager {
	constructor(kmsEndpoint, customerKey) {
		this.kmsEndpoint = kmsEndpoint;
		this.customerKey = customerKey;
	}

	async encryptApiKey(apiKey) {
		const response = await fetch(`${this.kmsEndpoint}/encrypt`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				keyId: this.customerKey,
				plaintext: apiKey,
			}),
		});
		return response.json();
	}

	async decryptApiKey(encryptedKey) {
		const response = await fetch(`${this.kmsEndpoint}/decrypt`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				keyId: this.customerKey,
				ciphertext: encryptedKey,
			}),
		});
		return response.json();
	}
}
```

---

## Alternative Security Architectures

### Backend-for-Frontend (BFF) Pattern

**Architecture:**

```
[Client] → [BFF Service] → [Anthropic API]
```

**Implementation:**

```javascript
// Client-side code
class SecureAnthropicClient {
	constructor(bffEndpoint) {
		this.bffEndpoint = bffEndpoint;
	}

	async makeRequest(messages, options = {}) {
		const response = await fetch(
			`${this.bffEndpoint}/claude/messages`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.getSessionToken()}`,
				},
				body: JSON.stringify({ messages, ...options }),
			},
		);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		return response.json();
	}

	getSessionToken() {
		// Retrieve session token from secure cookie or session storage
		return document.cookie.replace(
			/(?:(?:^|.*;\s*)session_token\s*\=\s*([^;]*).*$)|^.*$/,
			'$1',
		);
	}
}
```

**BFF Service (Node.js/Express):**

```javascript
app.post('/claude/messages', authenticateUser, async (req, res) => {
	try {
		// Retrieve user's API key from secure storage
		const apiKey = await getUserApiKey(req.user.id);

		const anthropic = new Anthropic({
			apiKey: apiKey,
		});

		const response = await anthropic.messages.create({
			model: 'claude-3-sonnet-20240229',
			max_tokens: 1024,
			messages: req.body.messages,
		});

		res.json(response);
	} catch (error) {
		res.status(500).json({ error: 'API request failed' });
	}
});
```

**Security Benefits:**

- API keys never exposed to client-side code
- Server-side key management and rotation
- User authentication and authorization
- Request logging and monitoring
- Rate limiting and usage controls

### Proxy Pattern with Temporary Tokens

**Architecture:**

```
[Client] → [Auth Service] → [API Proxy] → [Anthropic API]
```

**Implementation:**

```javascript
// Temporary token service
class TemporaryTokenService {
	constructor() {
		this.tokens = new Map();
		this.tokenExpiration = 15 * 60 * 1000; // 15 minutes
	}

	async generateTemporaryToken(userId, apiKey) {
		const token = crypto.randomUUID();
		const expiresAt = Date.now() + this.tokenExpiration;

		this.tokens.set(token, {
			userId,
			apiKey,
			expiresAt,
			usageCount: 0,
			maxUsage: 100,
		});

		// Schedule cleanup
		setTimeout(() => {
			this.tokens.delete(token);
		}, this.tokenExpiration);

		return token;
	}

	validateToken(token) {
		const tokenData = this.tokens.get(token);
		if (!tokenData) return null;

		if (Date.now() > tokenData.expiresAt) {
			this.tokens.delete(token);
			return null;
		}

		if (tokenData.usageCount >= tokenData.maxUsage) {
			this.tokens.delete(token);
			return null;
		}

		tokenData.usageCount++;
		return tokenData;
	}
}
```

**Security Features:**

- Short-lived tokens (15 minutes)
- Usage limits per token
- Automatic cleanup and expiration
- No long-term storage of API keys

---

## Real-World Examples

### Postman's BYOK Implementation

**Key Features:**

- Customer-managed encryption keys in AWS KMS
- End-to-end encryption of sensitive data
- Enterprise compliance and audit trails
- Granular access controls

**Security Model:**

- Data encrypted with customer's own keys
- Postman cannot decrypt customer data without customer keys
- Keys stored in customer's AWS KMS instance
- Automatic key rotation support

### Insomnia's Security Approach

**Key Features:**

- End-to-end encryption with AES-GCM-256
- Local storage with encryption at rest
- Git sync with encrypted data
- Secret environment variables

**Security Model:**

- Data encrypted using randomly generated 256-bit keys
- Encryption keys derived from user credentials
- No plaintext storage of sensitive data
- Optional cloud sync with maintained encryption

### Simon Willison's Haiku App

**Implementation Details:**

- Direct client-side API calls using CORS
- User-provided API keys
- In-memory storage only
- Clear security warnings to users

**Code Example:**

```javascript
const response = await fetch(
	'https://api.anthropic.com/v1/messages',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': userApiKey,
			'anthropic-version': '2023-06-01',
			'anthropic-dangerous-direct-browser-access': 'true',
		},
		body: JSON.stringify({
			model: 'claude-3-haiku-20240307',
			max_tokens: 1024,
			messages: [{ role: 'user', content: prompt }],
		}),
	},
);
```

---

## Security Recommendations Matrix

| Use Case            | Recommended Pattern             | Security Level | Implementation Complexity | User Experience |
| ------------------- | ------------------------------- | -------------- | ------------------------- | --------------- |
| Internal Tools      | Direct BYOK with encryption     | Medium         | Low                       | Excellent       |
| Public Applications | BFF Pattern                     | High           | High                      | Good            |
| Prototyping         | Session-based temporary storage | Medium         | Low                       | Good            |
| Enterprise          | BYOK with KMS                   | Very High      | Very High                 | Good            |
| Development         | Proxy with temp tokens          | Medium         | Medium                    | Good            |
| Mobile Apps         | BFF with OAuth                  | High           | High                      | Excellent       |

### Security Trade-offs

**Direct Client-Side Usage:**

- ✅ Simple implementation
- ✅ No server infrastructure required
- ❌ API keys exposed to client
- ❌ Difficult to rotate keys
- ❌ No usage monitoring

**BFF Pattern:**

- ✅ API keys never exposed
- ✅ Centralized key management
- ✅ Usage monitoring and controls
- ❌ Requires server infrastructure
- ❌ Additional complexity

**Temporary Token Pattern:**

- ✅ Limited exposure window
- ✅ Usage limits
- ✅ Automatic cleanup
- ❌ Token management complexity
- ❌ Requires token service

---

## Implementation Guidelines

### 1. Risk Assessment

Before implementing any pattern, assess:

- **Data sensitivity**: What data will be processed?
- **User base**: Internal vs. external users?
- **Compliance requirements**: GDPR, HIPAA, SOC2?
- **Infrastructure constraints**: Client-only vs. full-stack?

### 2. Security Controls

**Minimum Security Requirements:**

- Transport Layer Security (TLS/HTTPS)
- Input validation and sanitization
- Rate limiting and abuse prevention
- Error handling without information disclosure
- Audit logging for security events

**Enhanced Security Features:**

- Multi-factor authentication
- API key rotation mechanisms
- Usage monitoring and alerting
- Anomaly detection
- Compliance reporting

### 3. Key Management Best Practices

**Storage Security:**

- Never store keys in plaintext
- Use secure key derivation (PBKDF2, Argon2)
- Implement proper key rotation
- Use hardware security modules (HSMs) when available

**Access Controls:**

- Principle of least privilege
- Role-based access control
- Regular access reviews
- Automated deprovisioning

### 4. User Education

**Security Awareness:**

- Clear warnings about API key security
- Guidance on key generation and storage
- Instructions for incident response
- Regular security training

---

## Security Warnings and User Education

### Critical Security Warnings

**For Direct Client-Side Usage:**

```javascript
// Display prominent warning to users
const SecurityWarning = () => (
	<div className="security-warning">
		<h3>⚠️ Security Warning</h3>
		<p>
			Your API key will be stored locally and transmitted directly to
			Anthropic's servers. This approach is suitable for personal use
			and development only.
		</p>
		<ul>
			<li>Never share your API key with others</li>
			<li>Monitor your usage regularly</li>
			<li>Rotate your key if you suspect compromise</li>
			<li>Use a separate key for this application</li>
		</ul>
	</div>
);
```

### User Education Checklist

**Before Implementation:**

- [ ] Explain the security model clearly
- [ ] Provide key generation instructions
- [ ] Document security best practices
- [ ] Set up monitoring and alerts
- [ ] Create incident response procedures

**During Usage:**

- [ ] Display security reminders
- [ ] Monitor for suspicious activity
- [ ] Provide usage analytics
- [ ] Offer key rotation tools
- [ ] Maintain security documentation

**After Incidents:**

- [ ] Immediate key revocation procedures
- [ ] Incident investigation process
- [ ] User notification protocols
- [ ] Remediation steps
- [ ] Post-incident security review

---

## Conclusion

Implementing secure patterns for Anthropic API keys in client-side
applications requires careful consideration of security trade-offs,
user experience, and implementation complexity. While direct
client-side usage is possible with proper security measures,
enterprise applications should strongly consider Backend-for-Frontend
patterns or proxy architectures for enhanced security.

The key to successful implementation is:

1. **Risk-based approach**: Choose security patterns based on your
   specific risk profile
2. **Defense in depth**: Implement multiple layers of security
   controls
3. **User education**: Ensure users understand security
   responsibilities
4. **Continuous monitoring**: Implement monitoring and alerting for
   security events
5. **Regular reviews**: Conduct periodic security assessments and
   updates

Remember that security is an ongoing process, not a one-time
implementation. Regular reviews, updates, and improvements are
essential for maintaining a secure application environment.

---

## References

1. [Anthropic API Key Best Practices](https://support.anthropic.com/en/articles/9767949-api-key-best-practices-keeping-your-keys-safe-and-secure)
2. [Anthropic API Documentation](https://docs.anthropic.com/en/api/overview)
3. [Claude's API CORS Support](https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/)
4. [Postman BYOK Encryption](https://learning.postman.com/docs/administration/managing-your-team/byok-encryption/)
5. [Insomnia Security Features](https://docs.insomnia.rest/insomnia/security-features)
6. [Backend-for-Frontend Pattern](https://auth0.com/blog/the-backend-for-frontend-pattern-bff/)
7. [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
8. [API Security Best Practices](https://42crunch.com/token-management-best-practices/)
