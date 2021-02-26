import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";

import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveyUsers.filter(
      ({ value }) => value >= 0 && value <= 6
    ).length;

    const promoters = surveyUsers.filter(
      ({ value }) => value >= 9 && value <= 10
    ).length;

    const passives = surveyUsers.filter(({ value }) => value >= 7 && value <= 8)
      .length;

    const totalAnswers = surveyUsers.length;

    const calculate = Number(
      (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };
