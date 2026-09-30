-- Initial schema for PROJECT INTERNET.
CREATE TYPE "SiteStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SUSPENDED');
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "username" VARCHAR(24) NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Site" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "title" VARCHAR(80) NOT NULL,
  "description" VARCHAR(240) NOT NULL DEFAULT '',
  "status" "SiteStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Domain" (
  "id" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "hostname" VARCHAR(63) NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Page" (
  "id" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "description" VARCHAR(240) NOT NULL DEFAULT '',
  "content" JSONB NOT NULL,
  "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "InternalLink" (
  "id" TEXT NOT NULL,
  "sourcePageId" TEXT NOT NULL,
  "targetPageId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InternalLink_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Site_ownerId_updatedAt_idx" ON "Site"("ownerId", "updatedAt");
CREATE INDEX "Site_status_idx" ON "Site"("status");
CREATE UNIQUE INDEX "Domain_hostname_key" ON "Domain"("hostname");
CREATE INDEX "Domain_siteId_idx" ON "Domain"("siteId");
CREATE UNIQUE INDEX "Page_siteId_slug_key" ON "Page"("siteId", "slug");
CREATE INDEX "Page_status_publishedAt_idx" ON "Page"("status", "publishedAt");
CREATE UNIQUE INDEX "InternalLink_sourcePageId_targetPageId_key" ON "InternalLink"("sourcePageId", "targetPageId");
CREATE INDEX "InternalLink_targetPageId_idx" ON "InternalLink"("targetPageId");
ALTER TABLE "Site" ADD CONSTRAINT "Site_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Page" ADD CONSTRAINT "Page_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InternalLink" ADD CONSTRAINT "InternalLink_sourcePageId_fkey" FOREIGN KEY ("sourcePageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InternalLink" ADD CONSTRAINT "InternalLink_targetPageId_fkey" FOREIGN KEY ("targetPageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
