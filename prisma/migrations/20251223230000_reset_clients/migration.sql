-- Delete all clients (Cascade will handle related data if configured, otherwise we delete manually)
-- Since Keyword and Backlink relations in schema.prisma do NOT have onDelete: Cascade explicitly set in the provided snippet (except ContentItem), 
-- we should delete related data first to be safe and avoid foreign key constraint errors.

DELETE FROM "KeywordHistory";
DELETE FROM "Keyword";
DELETE FROM "Backlink";
DELETE FROM "ContentTask";
DELETE FROM "ContentItem";
DELETE FROM "SeoRoadmapTask";
DELETE FROM "TechnicalAudit";
DELETE FROM "AffiliateLink";
DELETE FROM "Earning";
DELETE FROM "Client";
