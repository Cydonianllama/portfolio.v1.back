import express, { response } from "express";
import Automation from 'schemas/automation.schema.js'
import User from 'schemas/user.schema.js'
import Workspace from 'schemas/workspace.schema.js'
import { type Request, type Response } from "express";
import type { GetAutomationsBackofiiceResponseDTO, AutomationBackofficeDTO } from "dtos/automation.backoffice.js";
import type { ResponseAPI } from "types/response.js";

const router = express.Router();

/* list automations */
router.get('/', async (req: Request, res: Response<ResponseAPI<GetAutomationsBackofiiceResponseDTO>>) => {
  try {
    const { query } = req.query
    const { } = req.params;

    const page = Math.max(1, parseInt(String(req.query?.page) || '') || 1);
    const limit = Math.max(1, parseInt(String(req.query?.limit) || '') || 20);

    const skip = (page - 1) * limit;

    let filter: any = {}

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }
      ]
    }

    const [automations, total] = await Promise.all([
      Automation.find(filter)
        .sort({ creationDate: -1 })
        .skip(skip)
        .limit(limit),
      Automation.countDocuments(filter)
    ]);

    const finalList: Array<AutomationBackofficeDTO> = [] 

    for (let item of automations) {
      
      let workspaceName = ''
      let userMail = ''

      // listar workspace
      if (item.workspaceId){
        try {
          const workspace = await Workspace.findOne({ id: item.workspaceId })
          if (workspace) {
            workspaceName = workspace.name;
          }
        } catch (error) {
          // error
        }
      }

      // listar usuario
      if (item.creationUserId) {
        try {
          const user_ = await User.findOne({ id: item.creationUserId })
          if (user_) {
            userMail = user_.email;
          }
        } catch (error) {
          // error
        }
      }

      finalList.push({
        automationId: item.id,
        creationDate: item.creationDate,
        title: item.title,
        userCreationId: item.creationUserId || '',
        userCreationMail: userMail,
        workspaceId: item.workspaceId || '',
        workspaceName: workspaceName
      })

    }

    res.json({
      status: true,
      data: { list: finalList },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

/* delete automations */
router.delete('/id', async (req: Request, res: Response) => {
  try {
    const automation = Automation.findOneAndDelete({ id: String(req.params.id) })

    if (!automation){
      res.status(404).json({
        status: false,
        error: "Automation not found"
      });
      return;
    }

    response.status(200).json({
      status: true
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

export default router;