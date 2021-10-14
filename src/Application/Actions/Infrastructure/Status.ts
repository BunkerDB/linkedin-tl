import { Request, Response } from "express";
import { ActionBase } from "../ActionBase";
import PromiseB from "bluebird";
import { ContainerInterface } from "../../Interface/ContainerInterface";
import { Span } from "opentracing";
import { GroupOverview, ITopicMetadata, Kafka, SeekEntry } from "kafkajs";
import { IoC } from "../../Dependencies";
import { Document, ListDatabasesResult, MongoClient } from "mongodb";
import * as fs from "fs";

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
      const actionKafkaStatus = this.getKafkaStatus();
      const actionDBMongoStatus = this.getDBMongoStatus();

      return PromiseB.all([actionKafkaStatus, actionDBMongoStatus]).then(
        (result) => {
          const statusCode: number =
            result[0].status && result[1].status ? 200 : 500;

          return {
            statusCode: statusCode,
            data: {
              kafka: result[0],
              mongo: result[1],
            },
          };
        }
      );
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
      return this.container.get(IoC.MongoClient);
    })
      .then((client: MongoClient) => {
        const actionListDatabases: Promise<ListDatabasesResult> = client
          .db()
          .admin()
          .listDatabases();

        //TODO: Check what kind of data has to return (Count or rows)
        const actionFindPostsRows: Promise<Document[]> = client
          .db()
          .collection("posts")
          .find({})
          .toArray();

        const actionFindDataRows: Promise<Document[]> = client
          .db()
          .collection("graphs_data")
          .find({})
          .toArray();

        const actionFindDemographicRows: Promise<Document[]> = client
          .db()
          .collection("graphs_demographic")
          .find({})
          .toArray();

        const actionFindDemographicPeriodRows: Promise<Document[]> = client
          .db()
          .collection("graphs_demographic_period")
          .find({})
          .toArray();

        return PromiseB.all([
          actionListDatabases,
          actionFindPostsRows,
          actionFindDataRows,
          actionFindDemographicRows,
          actionFindDemographicPeriodRows,
        ]).then((result) => {
          return {
            status: true,
            posts: result[1],
            graphs_data: result[2],
            graphs_demographic: result[3],
            graphs_demographic_period: result[4],
            db: result[0],
          };
        });
      })
      .catch((e) => {
        return {
          status: false,
          error: e,
          error1: JSON.stringify(e),
          error_message: e.message,
          mongo_client:  JSON.stringify(this.container.get(IoC.MongoClient)),
          dsn: dsn,
          pem_exists:pem_exists,
          pem_file:pem_file
        };
      });
  }

  protected getKafkaTopicsMetadata(): PromiseB<ITopicMetadata[]> {
    const kafka: Kafka = this.container.get(IoC.Kafka);
    return PromiseB.try(() => {
      return kafka.admin().fetchTopicMetadata({
        topics: [this.container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_00],
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
