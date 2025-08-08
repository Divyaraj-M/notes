-- Query to fetch the data from the knowledge_kav with fetch all the infoamrion about knwoledge_kav

SELECT
  Title,
  Summary,
  Article_Body__c,
  ArticleNumber,
  UrlName,
  Language,
  ArticleCreatedDate,
  LastPublishedDate,
  OwnerId,
  PublishStatus,
  NextReviewDate,
  ArticleArchivedDate,
  ArchivedById
FROM Knowledge__kav
WHERE PublishStatus = 'Online'
  AND Language = 'en_US'
  AND IsLatestVersion = TRUE


