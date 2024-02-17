import { type ModulesRepository } from '@/domain/course-management/application/repositories/modules-repository'
import { type Class } from '@/domain/course-management/enterprise/entities/class'
import { type ModuleWithClassesDTO } from '@/domain/course-management/enterprise/entities/dtos/module-with-classes'
import { type Module } from '@/domain/course-management/enterprise/entities/module'
import { prisma } from '..'
import { ClassMapper } from '../mappers/class-mapper'
import { ModuleMapper } from '../mappers/module-mapper'
import { ModuleWithClassesMapper } from '../mappers/module-with-classes-mapper'

export class PrismaModulesRepository implements ModulesRepository {
  constructor(
    private readonly moduleMapper: ModuleMapper
  ) {}

  async findById(id: string): Promise<Module | null> {
    const module = await prisma.module.findUnique({
      where: {
        id
      }
    })

    if (!module) {
      return null
    }

    const domainModule = ModuleMapper.toDomain(module)

    return domainModule
  }

  async findManyByCourseId(id: string): Promise<Module[]> {
    const modules = await prisma.module.findMany({
      where: {
        courseId: id
      },
      orderBy: {
        moduleNumber: 'asc'
      }
    })

    return modules.map(module => ModuleMapper.toDomain(module))
  }

  async findManyClassesByCourseId(courseId: string): Promise<Class[]> {
    const classes = await prisma.class.findMany({
      where: {
        module: {
          courseId
        }
      }
    })

    return classes.map(classToMap => ClassMapper.toDomain(classToMap))
  }

  async findModuleWithClassesById(id: string): Promise<ModuleWithClassesDTO | null> {
    const moduleWithClasses = await prisma.module.findUnique({
      where: {
        id
      },
      include: {
        classes: true
      }
    })

    if (!moduleWithClasses) {
      return null
    }

    const domainModuleWithClasses = ModuleWithClassesMapper.toDomain(moduleWithClasses)

    return domainModuleWithClasses
  }

  async create(module: Module): Promise<Module> {
    const infraModule = await this.moduleMapper.toPrisma(module)

    await prisma.module.create({
      data: infraModule
    })

    return module
  }

  async save(module: Module): Promise<void> {
    const infraModule = await this.moduleMapper.toPrisma(module)

    await prisma.module.update({
      where: {
        id: infraModule.id
      },
      data: infraModule
    })
  }

  async delete(module: Module): Promise<void> {
    await prisma.module.delete({
      where: {
        id: module.id.toString()
      }
    })
  }
}
