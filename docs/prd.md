. Tech Stack Architecture
•	Language: TypeScript
•	Framework: Express.js
•	Database: PostgreSQL (with Prisma or TypeORM for type-safety)
•	Authentication: JWT (JSON Web Tokens) with Cookies or Bearer Tokens
•	Payments: Stripe API (Integration for entry fees)
•	Validation: Zod or Joi (Request body validation)
________________________________________
2. Database Schema (Relational Model)
Your PostgreSQL schema should include the following core tables:
Users Table
•	id: UUID (Primary Key)
•	name: String
•	email: String (Unique)
•	password: String (Hashed)
•	photoURL: String
•	role: Enum (admin, creator, user)
•	bio/address: String (Optional)                     
Contests Table
•	id: UUID (Primary Key)
•	creatorId: UUID (Foreign Key -> User)
•	name: String
•	image: String
•	description: Text
•	price: Decimal
•	prizeMoney: Decimal
•	taskInstruction: Text
•	type: String (e.g., "Article Writing", "Image Design")
•	deadline: DateTime
•	status: Enum (pending, confirmed, rejected)
•	winnerId: UUID (Foreign Key -> User, Nullable)
•	participantCount: Integer (Default: 0)
Submissions Table
•	id: UUID (Primary Key)
•	contestId: UUID (Foreign Key -> Contest)
•	userId: UUID (Foreign Key -> User)
•	taskLink: Text
•	submittedAt: DateTime (Default: now)
Payments Table
•	id: UUID (Primary Key)
•	transactionId: String (Unique)
•	userId: UUID (Foreign Key -> User)
•	contestId: UUID (Foreign Key -> Contest)
•	amount: Decimal
•	status: String
________________________________________
3. API Endpoints
Auth & User Routes
•	POST /api/auth/register: Create user and return JWT.
•	POST /api/auth/login: Validate credentials and return JWT.
•	GET /api/users/me: Get current user profile (Private).
•	PATCH /api/users/update: Update profile name, photo, bio (Private).
•	GET /api/admin/users: Get all users (Admin only).
•	PATCH /api/admin/users/role: Update user role (Admin only).
Contest Routes
•	GET /api/contests: Get all confirmed contests (Filter by type, Search by name/type).
•	GET /api/contests/popular: Get top 5-6 contests sorted by participantCount.
•	GET /api/contests/:id: Get detailed info for a single contest.
•	POST /api/contests: Create a new contest (Creator only, status defaults to pending).
•	PATCH /api/contests/:id: Update contest (Creator only, allowed only if status is pending).
•	DELETE /api/contests/:id: Delete contest (Creator/Admin only).
Admin Control Routes
•	GET /api/admin/contests: Get all contests regardless of status.
•	PATCH /api/admin/contests/:id/status: Change status to confirmed or rejected.
Participation & Payment
•	POST /api/payments/create-intent: Create Stripe payment intent for a specific contest fee.
•	POST /api/payments/confirm: Verify transaction, add user to participants, increment participantCount.
•	GET /api/users/my-contests: Get list of contests the user has paid for.
•	GET /api/users/my-wins: Get list of contests where user is marked as winnerId.
Submission & Winning
•	POST /api/submissions: Submit task link (Requires payment check and deadline check).
•	GET /api/submissions/:contestId: View all submissions for a contest (Creator only).
•	PATCH /api/contests/:id/declare-winner: Assign a userId to winnerId field (Creator only).
________________________________________
4. Key Logic & Security
•	JWT Middleware: Verify tokens for all /api/private/* routes.
•	Role Middleware: Create a helper to check req.user.role === 'admin' or 'creator'.
•	Deadline Enforcement: The backend must reject POST /api/submissions if the current date is past the contest deadline.
•	Transaction Safety: Use DB transactions when confirming payment to ensure the participantCount and Payments table are updated simultaneously.
•	Search Logic: Use PostgreSQL ILIKE or Full-Text Search for the banner search bar.
________________________________________
5. Dashboard Statistics (Aggregation)
For the user's "Win Percentage Chart," create a specific endpoint:
•	GET /api/users/stats

