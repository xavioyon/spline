/*
 * Copyright 2017 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package za.co.absa.spline.web.html

import org.springframework.context.annotation.{Bean, ComponentScan, Configuration}
import org.springframework.web.servlet.ViewResolver
import org.springframework.web.servlet.config.annotation.{DefaultServletHandlerConfigurer, EnableWebMvc, WebMvcConfigurer}
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver
import org.thymeleaf.spring5.view.ThymeleafViewResolver
import org.thymeleaf.spring5.{ISpringTemplateEngine, SpringTemplateEngine}
import org.thymeleaf.templatemode.TemplateMode.HTML
import org.thymeleaf.templateresolver.ITemplateResolver

@Configuration
@EnableWebMvc
@ComponentScan(Array("za.co.absa.spline.web.html.controller"))
class HTMLDispatcherConfig extends WebMvcConfigurer {

  override def configureDefaultServletHandling(configurer: DefaultServletHandlerConfigurer): Unit = configurer.enable()

  @Bean
  def viewResolver: ViewResolver = new ThymeleafViewResolver() {
    setTemplateEngine(templateEngine)
    setCharacterEncoding("UTF-8")
  }

  @Bean
  def templateEngine: ISpringTemplateEngine = new SpringTemplateEngine() {
    setTemplateResolver(templateResolver)
  }

  @Bean
  def templateResolver: ITemplateResolver = new SpringResourceTemplateResolver() {
    setPrefix("/WEB-INF/html/")
    setSuffix(".html")
    setTemplateMode(HTML)
    setCacheable(false)
  }

}
