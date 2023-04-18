import { S3 } from "@aws-sdk/client-s3"
import type { APIGatewayProxyHandler } from "aws-lambda"
import chrome from "chrome-aws-lambda"
import path from "path"
import invariant from "tiny-invariant"
import { z } from "zod"
import { renderToString } from "react-dom/server"

import { Stories } from "../domain/stories"

const ext = "png"
const ContentType = `image/${ext}`
const Bucket = process.env.BucketName
const s3 = new S3({})

// chrome-aws-lambda handles loading locally vs from the Layer
const puppeteer = chrome.puppeteer

const querySchema = z.object({
  type: z.literal("story"),
  storyId: z.string(),
  partId: z.string(),
})

type QueryParams = z.infer<typeof querySchema>

export const handler: APIGatewayProxyHandler = async (event) => {
  const title = parseTitle(file)

  // Check if it's a valid request
  if (file === null) {
    return createErrorResponse()
  }

  const query = event.queryStringParameters
  invariant(query, "Expected options to be defined")

  const args = querySchema.parse(query)

  const story = await Stories.getStory({ storyId: args.storyId })
  const template = "story"

  const key = generateS3Key({ template, title, options: query })

  // Check the S3 bucket
  const fromBucket = await get({ Key: key })

  invariant(
    typeof fromBucket === "string" || fromBucket instanceof Buffer,
    "Expected buffer to be a string or Buffer",
  )

  // Return from the bucket
  if (fromBucket) {
    return createResponse({ buffer: fromBucket })
  }

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
  })

  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 630,
  })

  // Navigate to the url
  await page.goto(
    `file:${path.join(
      process.cwd(),
      `templates/${template}.html`,
    )}?title=${title}&${query}`,
  )

  // Wait for page to complete loading
  await page.evaluate("document.fonts.ready")

  // Take screenshot
  const buffer = await page.screenshot()

  invariant(
    typeof buffer === "string" || buffer instanceof Buffer,
    "Expected buffer to be a string or Buffer",
  )

  // Upload to the bucket
  await upload({ Key: key, Body: buffer })

  return createResponse({ buffer })
}

function generateS3Key(args: { params: QueryParams }) {
  const parts = Object.values(args.params).map((part) =>
    encodeURIComponent(part),
  )
  return parts.join("/")
}

async function upload({ Key, Body }: { Key: string; Body: string | Buffer }) {
  await s3.putObject({
    Key,
    Body,
    Bucket,
    ContentType,
  })
}

async function get({ Key }: { Key: string }) {
  // Disabling S3 lookup on local
  if (process.env.IS_LOCAL) {
    return null
  }

  const params = { Key, Bucket }

  try {
    const { Body } = await s3.getObject(params)
    return Body
  } catch (e) {
    return null
  }
}

function createResponse({ buffer }: { buffer: string | Buffer }) {
  return {
    statusCode: 200,
    isBase64Encoded: true,
    body: buffer.toString("base64"),
    headers: { "Content-Type": ContentType },
  }
}

function createErrorResponse() {
  return {
    statusCode: 500,
    body: "Invalid request",
  }
}
