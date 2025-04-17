import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Role models
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(), // JSON string of module permissions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

// User models
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
  roleId: integer("role_id"), // Reference to roles table
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Client models
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

// Company models
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  clientId: integer("client_id").notNull(),
  industry: text("industry"),
  size: text("size"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

// Prospect models
export const prospects = pgTable("prospects", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position").notNull(),
  skills: text("skills"),
  resume: text("resume"),
  voiceMessageUrl: text("voice_message_url"),
  status: text("status", { 
    enum: ["sourcing", "contacted", "interview", "client_review", "budget", "contract", "hired", "rejected"] 
  }).notNull().default("sourcing"),
  clientId: integer("client_id"),
  companyId: integer("company_id"),
  notes: text("notes"),
  notesHistory: text("notes_history").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Workflow tracking boolean fields
  isInterviewed: boolean("is_interviewed").default(false),
  isClientApproved: boolean("is_client_approved").default(false),
  isBudgetAgreed: boolean("is_budget_agreed").default(false),
});

export const insertProspectSchema = createInsertSchema(prospects).omit({
  id: true,
  createdAt: true,
});

// Hero models (hired prospects)
export const heroes = pgTable("heroes", {
  id: serial("id").primaryKey(),
  prospectId: integer("prospect_id").notNull().unique(),
  startDate: timestamp("start_date"),
  contractId: integer("contract_id"),
  clientId: integer("client_id").notNull(),
  companyId: integer("company_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHeroSchema = createInsertSchema(heroes).omit({
  id: true,
  createdAt: true,
});

// Contract models
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  heroId: integer("hero_id").notNull(),
  clientId: integer("client_id").notNull(),
  companyId: integer("company_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  compensation: doublePrecision("compensation").notNull(),
  companyPayment: doublePrecision("company_payment"),
  profit: doublePrecision("profit"),
  status: text("status", { enum: ["draft", "signed", "active", "completed", "terminated"] }).notNull().default("draft"),
  document: text("document"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
});

// Invoice models
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  contractId: integer("contract_id").notNull(),
  heroId: integer("hero_id").notNull(),
  clientId: integer("client_id").notNull(),
  companyId: integer("company_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  status: text("status", { enum: ["pending", "paid", "overdue", "cancelled"] }).notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  stripeInvoiceId: text("stripe_invoice_id"),
  stripeInvoiceUrl: text("stripe_invoice_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

// Define types from schemas
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type Prospect = typeof prospects.$inferSelect;

export type InsertHero = z.infer<typeof insertHeroSchema>;
export type Hero = typeof heroes.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

// Interview models
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  prospectId: integer("prospect_id").notNull(),
  title: text("title").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  meetingLink: text("meeting_link"),
  interviewerIds: text("interviewer_ids").array(), // array of user IDs
  notes: text("notes"),
  status: text("status", { enum: ["scheduled", "completed", "cancelled"] }).notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;

// Job Openings
export const jobOpenings = pgTable("job_openings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type", { enum: ["full_time", "part_time", "contract", "remote"] }).notNull(),
  salary: text("salary"),
  isActive: boolean("is_active").default(true).notNull(),
  clientId: integer("client_id"),
  companyId: integer("company_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJobOpeningSchema = createInsertSchema(jobOpenings).omit({
  id: true,
  createdAt: true,
});

export type InsertJobOpening = z.infer<typeof insertJobOpeningSchema>;
export type JobOpening = typeof jobOpenings.$inferSelect;

// Job Applications
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobOpeningId: integer("job_opening_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  resumeUrl: text("resume_url"),
  voiceMessageUrl: text("voice_message_url"),
  coverLetter: text("cover_letter"),
  status: text("status", { enum: ["new", "reviewing", "interview", "offered", "hired", "rejected", "converted"] }).default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
});

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

// Job Requests (from clients)
export const jobRequests = pgTable("job_requests", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  companyId: integer("company_id").notNull(),
  clientName: text("client_name"),
  companyName: text("company_name"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type", { enum: ["full_time", "part_time", "contract", "remote"] }).notNull(),
  salary: text("salary"),
  status: text("status", { enum: ["pending", "approved", "rejected", "published"] }).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJobRequestSchema = createInsertSchema(jobRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJobRequest = z.infer<typeof insertJobRequestSchema>;
export type JobRequest = typeof jobRequests.$inferSelect;
