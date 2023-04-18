import * as cdk from "aws-cdk-lib"
import * as acm from "aws-cdk-lib/aws-certificatemanager"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as route53 from "aws-cdk-lib/aws-route53"
import * as targets from "aws-cdk-lib/aws-route53-targets"
import * as s3 from "aws-cdk-lib/aws-s3"
import type { StackContext } from "sst/constructs"
import { Bucket, Function, use } from "sst/constructs"
import invariant from "tiny-invariant"

import { Database } from "./database"

export function OpenGraph(ctx: StackContext) {
  const { DATABASE_URL } = use(Database)

  const bucket = new Bucket(ctx.stack, "OgImages", {
    cdk: {
      bucket: {
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
  })

  const fn = new Function(ctx.stack, "OgFunction", {
    handler: "server/functions/og.handler",
    timeout: "2 minutes",
    layers: [
      // Load Chrome in a Layer
      lambda.LayerVersion.fromLayerVersionArn(
        ctx.stack,
        "Layer",
        // @see https://github.com/shelfio/chrome-aws-lambda-layer
        "arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:31",
      ),
    ],
    bind: [bucket, DATABASE_URL],
    environment: {
      // Set $HOME for OS to pick up the non Latin fonts
      // from the .fonts/ directory
      HOME: "/var/task",
    },
    copyFiles: [
      {
        from: "templates",
        to: "templates",
      },
      {
        from: ".fonts",
        to: ".fonts",
      },
    ],
    nodejs: {
      install: ["chrome-aws-lambda"],
    },
  })

  const domainName =
    ctx.app.stage === "production"
      ? "api.hivemindtales.com"
      : `api.${ctx.app.stage}.hivemindtales.com`
  const hostedZone = "hivemindtales.com"

  const certificate = new acm.DnsValidatedCertificate(
    ctx.stack,
    "OgSiteCertificate",
    {
      domainName: domainName,
      hostedZone: route53.HostedZone.fromLookup(ctx.stack, "HostedZone", {
        domainName: hostedZone,
      }),
      region: "us-east-1", // CloudFront requires ACM certificates to be in the 'us-east-1' region
    },
  )

  invariant(fn.url, "Function URL is not defined")

  const distribution = new cloudfront.Distribution(
    ctx.stack,
    "OgDistribution",
    {
      defaultBehavior: {
        origin: new origins.HttpOrigin(fn.url),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: new cloudfront.CachePolicy(ctx.stack, "OgCdnCachePolicy", {
          minTtl: cdk.Duration.seconds(0),
          maxTtl: cdk.Duration.days(365),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
          enableAcceptEncodingBrotli: true,
          enableAcceptEncodingGzip: true,
        }),
      },
      domainNames: [domainName],
      certificate: certificate,
    },
  )

  // Create a Route53 record for the custom domain
  new route53.ARecord(ctx.stack, "OgAliasRecord", {
    zone: route53.HostedZone.fromLookup(ctx.stack, "ExistingHostedZone", {
      domainName: hostedZone,
    }),
    recordName: domainName,
    target: route53.RecordTarget.fromAlias(
      new targets.CloudFrontTarget(distribution),
    ),
  })

  return {
    url: `https://${domainName}`,
  }
}
