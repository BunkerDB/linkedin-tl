import { Request, Response } from "express";
import { ActionBase } from "../ActionBase";
import PromiseB from "bluebird";
import { ContainerInterface } from "../../Interface/ContainerInterface";
import { Span } from "opentracing";
import { GroupOverview, ITopicMetadata, Kafka, SeekEntry } from "kafkajs";
import { IoC } from "../../Dependencies";
import { PrismaClient } from "@prisma/client";
import { Document, ListDatabasesResult, MongoClient } from "mongodb";

export class Status extends ActionBase {
  constructor(args: { container: ContainerInterface }) {
    super(args);
  }
  protected doCall(_: {
    req: Request;
    res: Response;
    span: Span;
  }): PromiseB<any> {
    return PromiseB.try(() => {
      const actionDBStatus = this.getDBStatus();
      const actionKafkaStatus = this.getKafkaStatus();
      const actionDBMongoStatus = this.getDBMongoStatus();

      return PromiseB.all([
        actionDBStatus,
        actionKafkaStatus,
        actionDBMongoStatus,
      ]).then((result) => {
        return {
          db: result[0],
          kafka: result[1],
          mongo: result[2],
        };
      });
    });
  }

  private getDBStatus(): PromiseB<any> {
    const prisma: PrismaClient = this.container.get(IoC.PrismaClient);

    const actionUserStatus: Promise<number> = prisma.example.count();

    return PromiseB.all([actionUserStatus])
      .then((result) => {
        return {
          status: true,
          example: result[0],
        };
      })
      .catch((e) => {
        return {
          status: false,
          error: e.message ? e.message : e,
        };
      });
  }

  private getKafkaStatus(): PromiseB<any> {
    //Note for Devs: Kafka status fails if KAFKA_ADVERTISED_HOST_NAME=kafka and MS isn't running into docker server instance (Configure local IP instead to run outside docker)
    const kafka: Kafka = this.container.get(IoC.Kafka);

    const actionTopicsMetadata = this.getKafkaTopicsMetadata();
    const actionTopicsOffsets = this.getKafkaTopicsOffsets();
    const actionGroups: Promise<{
      groups: GroupOverview[];
    }> = kafka.admin().listGroups();

    const actionDescribeCluster: Promise<{
      brokers: Array<{ nodeId: number; host: string; port: number }>;
      controller: number | null;
      clusterId: string;
    }> = kafka.admin().describeCluster();

    return PromiseB.all([
      actionTopicsMetadata,
      actionTopicsOffsets,
      actionGroups,
      actionDescribeCluster,
    ])
      .then((result) => {
        return {
          status: true,
          topics: result[0],
          topicsOffsets: result[1],
          groups: result[2],
          cluster: result[3],
        };
      })
      .catch((e) => {
        return {
          status: false,
          error: e,
        };
      });
  }

  private getDBMongoStatus(): PromiseB<any> {
    return PromiseB.try(() => {
      return this.container.get(IoC.MongoClient).connect();
    })
      .then((client: MongoClient) => {
        //TODO:
        const actionListDatabases: Promise<ListDatabasesResult> = client
          .db()
          .admin()
          .listDatabases();

        const actionFindPostsRows: Promise<Document[]> = client
          .db("db_etl_linkedin_mongo")
          .collection("posts")
          .find({})
          .toArray();

        return PromiseB.all([actionListDatabases, actionFindPostsRows]).then(
          (result) => {
            return {
              status: true,
              databases: result[0],
              posts: result[1],
            };
          }
        );
      })
      .catch((e) => {
        return {
          status: false,
          error: e.message ? e.message : e,
        };
      });
  }

  protected getKafkaTopicsMetadata(): PromiseB<ITopicMetadata[]> {
    const kafka: Kafka = this.container.get(IoC.Kafka);
    return PromiseB.try(() => {
      return kafka.admin().fetchTopicMetadata({
        topics: [
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_00,
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_01,
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_02,
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_03,
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_04,
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_05,
          // this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_10_0,
          // this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_10_1,
          this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_11,
        ],
      });
    }).then((result) => {
      return result.topics;
    });
  }

  protected getKafkaTopicsOffsets(): PromiseB<
    {
      offsets: Array<SeekEntry & { metadata: string | null }>;
      topic: string;
      groupId: string;
    }[]
  > {
    const kafka: Kafka = this.container.get(IoC.Kafka);
    const topics: { topic: string; groupId: string }[] = [
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_00,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_00,
      },
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_01,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_01,
      },
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_02,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_02,
      },
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_03,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_03,
      },
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_04,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_04,
      },
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_05,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_05,
      },
      // {
      //   topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_10_0,
      //   groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_10,
      // },
      // {
      //   topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_10_1,
      //   groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_10,
      // },
      {
        topic: this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_11,
        groupId: this.container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_11,
      },
    ];

    return PromiseB.map(topics, (relationTopic) => {
      return PromiseB.try(() => {
        return kafka.admin().fetchOffsets({
          groupId: relationTopic.groupId,
          topic: relationTopic.topic,
        });
      }).then((result) => {
        return {
          groupId: relationTopic.groupId,
          topic: relationTopic.topic,
          offsets: result,
        };
      });
    });
  }
}
